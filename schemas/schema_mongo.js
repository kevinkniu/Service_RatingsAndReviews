const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fetcher', { useNewUrlParser: true, useUnifiedTopology: true });

const reviewSchema = new mongoose.Schema({
  product_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  photos: [{ url: String }],
  reported: Boolean,
});

const charsSchema = new mongoose.Schema({
  product_id: Number,
  characteristic_id: Number,
  characteristic: String,
  value: Number,
});

const rrChars = mongoose.model('rr_chars', charsSchema);
const rrReviews = mongoose.model('rr_reviews', reviewSchema);
