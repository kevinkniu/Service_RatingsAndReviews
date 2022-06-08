/* eslint-disable no-console */

const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
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
    json_agg(
      json_build_object(
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
ORDER BY r.review_id ASC
LIMIT ${count}
OFFSET ${(page - 1) * count}
`;
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

module.exports = router;
