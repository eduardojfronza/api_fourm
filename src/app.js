
const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const loginRouter = require('./routes/loginRouter');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api', userRouter);
app.use('/api/auth', loginRouter);

// Post
app.use('/api', postRouter );

app.set('port', process.env.PORT || 3333);

module.exports = app;