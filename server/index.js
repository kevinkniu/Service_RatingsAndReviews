/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const db = require('../db');
const router = require('./routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/reviews', router);

app.listen(PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
