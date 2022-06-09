/* eslint-disable no-console */

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
      console.log(err);
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
  SELECT * FROM
  ( SELECT
    json_build_object (
      1, SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END),
      2, SUM(CASE WHEN r.rating = 2 THEN 2 ELSE 0 END),
      3, SUM(CASE WHEN r.rating = 3 THEN 3 ELSE 0 END),
      4, SUM(CASE WHEN r.rating = 4 THEN 4 ELSE 0 END),
      5, SUM(CASE WHEN r.rating = 5 THEN 5 ELSE 0 END)
    ) AS ratings
    FROM rrReviews r
    WHERE r.product_id = ${req.query.product_id}
  ) AS ratings,
  ( SELECT
    json_build_object(
      false, SUM(CASE WHEN r.recommend = false THEN 1 ELSE 0 END),
      true, SUM(CASE WHEN r.recommend = true THEN 1 ELSE 0 END)
    ) AS recommended
  FROM rrReviews r
  WHERE r.product_id = ${req.query.product_id}
  ) AS recommended
  ;`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const output = {
        product_id: req.query.product_id,
        results: results.rows,
      };
      res.status(200).send(output);
    }
  });
});

module.exports = router;
