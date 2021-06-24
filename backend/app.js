const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const Post = require('./models/post');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(
  "mongodb+srv://jacob:" + process.env.MONGO_ATLAS_PW + "@social-app.hmgcy.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
)
.then(() => {
  console.log("Connected to database!!");
}).catch(err => {
  console.log(err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, strict-origin-when-cross-origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
