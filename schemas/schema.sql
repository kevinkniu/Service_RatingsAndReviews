DROP DATABASE IF EXISTS RR;
CREATE DATABASE RR;

\c rr;

DROP TABLE IF EXISTS rrReviews CASCADE;

CREATE TABLE rrReviews (
  review_id SERIAL NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  review_date VARCHAR NOT NULL,
  summary VARCHAR NOT NULL,
  body VARCHAR NOT NULL,
  recommend BOOLEAN DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response VARCHAR,
  helpfulness INT DEFAULT 0
);

COPY rrReviews(review_id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/apple/Desktop/HackReactor/Senior/SDC/data/reviews.csv'
DELIMITER ','
CSV HEADER;
SELECT SETVAL('rrReviews_review_id_seq', (SELECT MAX(review_id) FROM rrReviews) + 1);


DROP TABLE IF EXISTS rrChars CASCADE;

CREATE TABLE rrChars (
  chars_id SERIAL NOT NULL PRIMARY KEY,
  product_id INT,
  name VARCHAR NOT NULL
);

COPY rrChars(chars_id, product_id, name)
FROM '/Users/apple/Desktop/HackReactor/Senior/SDC/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

DROP TABLE IF EXISTS rrCharsReviews CASCADE;

CREATE TABLE rrCharsReviews (
  charsReview_id SERIAL NOT NULL PRIMARY KEY,
  chars_id INT REFERENCES rrChars(chars_id),
  review_id INT REFERENCES rrReviews(review_id),
  value INT NOT NULL
);

COPY rrCharsReviews(charsReview_id, chars_id, review_id, value)
FROM '/Users/apple/Desktop/HackReactor/Senior/SDC/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
SELECT SETVAL('rrCharsReviews_charsReview_id_seq', (SELECT MAX(charsReview_id) FROM rrCharsReviews) + 1);

DROP TABLE IF EXISTS rrReviewPhotos CASCADE;

CREATE TABLE rrReviewPhotos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  review_id INT REFERENCES rrReviews(review_id),
  photo_url VARCHAR NOT NULL
);

COPY rrReviewPhotos(photo_id, review_id, photo_url)
FROM '/Users/apple/Desktop/HackReactor/Senior/SDC/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;
SELECT SETVAL('rrReviewPhotos_photo_id_seq', (SELECT MAX(photo_id) FROM rrReviewPhotos) + 1);

ALTER TABLE rrReviews
ALTER COLUMN review_date TYPE TIMESTAMP USING (to_timestamp(review_date::decimal / 1000));

CREATE INDEX ON rrReviews(product_id);
CREATE INDEX ON rrReviews(review_id);
CREATE INDEX ON rrReviewPhotos(review_id);
CREATE INDEX ON rrReviewPhotos(photo_id);
CREATE INDEX ON rrChars(product_id);
CREATE INDEX ON rrChars(chars_id);
CREATE INDEX ON rrCharsReviews(review_id);
CREATE INDEX ON rrCharsReviews(chars_id);
CREATE INDEX ON rrReviewPhotos(review_id);