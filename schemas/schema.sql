DROP DATABASE IF EXISTS RR;
CREATE DATABASE RR;

DROP TABLE IF EXISTS rrProducts CASCADE;

CREATE TABLE rrProducts (
  product_id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
);


DROP TABLE IF EXISTS rrReviews CASCADE;

CREATE TABLE rrReviews (
  product_id REFERENCES rrProducts(product_id),
  review_id SERIAL NOT NULL PRIMARY KEY,
  rating INTEGER NOT NULL,
  summary VARCHAR NOT NULL,
  recommend BOOLEAN DEFAULT FALSE,
  response VARCHAR,
  body VARCHAR NOT NULL,
  review_date VARCHAR NOT NULL,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  helpfulness INT DEFAULT 0,
  reported BOOLEAN DEFAULT FALSE,
);

DROP TABLE IF EXISTS rrChars CASCADE;

CREATE TABLE rrChars (
  product_id REFERENCES rrProducts(product_id),
  chars_id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
);

DROP TABLE IF EXISTS rrCharsRatings CASCADE;

CREATE TABLE rrCharsRatings (
  review_id REFERENCES rrReviews(review_id),
  chars_id REFERENCES rrChars(chars_id),
  value INT NOT NULL,
);

DROP TABLE IF EXISTS rrReviewPhotos CASCADE;

CREATE TABLE rrReviewPhotos (
  review_id REFERENCES rrReviews(review_id),
  photo_id SERIAL NOT NULL,
  photo_url VARCHAR NOT NULL,
);
