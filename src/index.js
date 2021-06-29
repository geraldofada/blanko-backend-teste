const express = require('express');
require('dotenv').config();

const users = require('./routes/users');

app = express();
app.use(express.json());
app.use('/users', users);


app.listen(process.env.PORT);
