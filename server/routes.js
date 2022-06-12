/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  let sort;
  switch (req.query.sort) {
    case 'helpful':
      sort = 'r.helpfulness';
      break;
    case 'relevant':
      sort = 'r.review_date';
      break;
    default:
      sort = 'r.review_date';
  }
  const query = `
  SELECT
    r.review_id,
    r.rating,
    r.summary,
    r.recommend,
    r.response,
    r.body,
    r.review_date AS date,
    r.reviewer_name,
    r.helpfulness,
    COALESCE (
      json_agg (
        json_build_object (
          'id', p.photo_id,
          'url', p.photo_url
        )
      )
  FILTER (WHERE p.photo_id IS NOT NULL), '[]') AS photos
  FROM rrReviews r
  LEFT OUTER JOIN rrReviewPhotos p
  ON r.review_id = p.review_id
  WHERE product_id = ${req.query.product_id}
  GROUP BY r.review_id
  ORDER BY ${sort} DESC
  LIMIT ${count}
  OFFSET ${(page - 1) * count}
  ;`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const output = {
        product: req.query.product_id,
        page,
        count,
        results: results.rows,
      };
      res.status(200).send(output);
    }
  });
});

router.get('/meta', (req, res) => {
  const query = `
  SELECT
  ${req.query.product_id} AS product_id,
  * FROM
  ( SELECT
    json_object_agg (
      ratings.rating, count
    ) AS ratings
    FROM (
      SELECT
        r.rating,
        COUNT(*)
      FROM rrReviews r
      WHERE r.product_id = ${req.query.product_id}
      GROUP BY r.rating
    ) AS ratings
  ) AS ratings,
  ( SELECT
    json_build_object(
      false, SUM(CASE WHEN r.recommend = false THEN 1 ELSE 0 END),
      true, SUM(CASE WHEN r.recommend = true THEN 1 ELSE 0 END)
    ) AS recommended
  FROM rrReviews r
  WHERE r.product_id = ${req.query.product_id}
  ) AS recommended,
  ( SELECT
    json_object_agg (
      chars.name, chars.charsArray
    ) AS characteristics
    FROM (
      SELECT
        c.name,
        json_build_object(
          'id', c.chars_id,
          'value', AVG(cr.value)
        ) AS charsArray
      FROM rrChars c
      INNER JOIN rrCharsReviews cr
      ON c.chars_id = cr.chars_id
      WHERE c.product_id = ${req.query.product_id}
      GROUP BY c.chars_id
    ) AS chars
  ) AS characteristics
  ;`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results.rows[0]);
    }
  });
});

router.post('/', async (req, res) => {
  const date = new Date().toISOString();
  const queryArray = [];
  const reviewQuery = `
  INSERT INTO rrReviews (
    product_id,
    rating,
    review_date,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
  )
  RETURNING review_id
  ;`;
  const result = await db.query(reviewQuery, [
    req.body.product_id,
    req.body.rating,
    date,
    req.body.summary,
    req.body.body,
    req.body.recommend,
    req.body.name,
    req.body.email,
  ]);
  const reviewID = result.rows[0].review_id;
  if (req.body.photos.length) {
    req.body.photos.forEach((url) => {
      queryArray.push(db.query(`
      INSERT INTO rrReviewPhotos (
        review_id,
        photo_url
      )
      VALUES (
        $1,
        $2
      )
      ;`, [reviewID, url]));
    });
  }
  const chars = req.body.characteristics;
  if (Object.keys(chars).length) {
    Object.keys(chars).forEach((char) => {
      queryArray.push(db.query(`
      INSERT INTO rrCharsReviews (
        chars_id,
        review_id,
        value
      ) VALUES (
        $1,
        $2,
        $3
      )
      ;`, [char, reviewID, chars[char]]));
    });
  }
  Promise.all(queryArray)
    .then(() => res.status(200).send('review added!'))
    .catch((err) => res.status(500).send(err));
});

router.put('/:review_id/helpful', (req, res) => {
  const query = `
  UPDATE rrReviews SET helpfulness = helpfulness + 1 WHERE review_id = ${req.params.review_id};`;
  db.query(query, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('helpfulness added!');
    }
  });
});

router.put('/:review_id/report', (req, res) => {
  const query = `
  UPDATE rrReviews SET reported = true WHERE review_id = ${req.params.review_id};`;
  db.query(query, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('reported!');
    }
  });
});

module.exports = router;
