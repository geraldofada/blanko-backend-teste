const express = require('express');
const cors = require('cors');
require('dotenv').config();

const users = require('./routes/users');

const corsOptions = {
  origin: process.env.ORIGIN_FRONTEND,
  optionsSuccessStatus: 200
};

app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/users', users);


app.listen(process.env.PORT);
