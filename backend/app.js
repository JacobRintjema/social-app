const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://jacob:PvM1gSJQ7596pjMn@social-app.hmgcy.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
.then(() => {
  console.log("Connected to database!!");
}).catch(err => {
  console.log(err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then(data => {
    res.status(201).json({
      message: 'Post was successfully added.',
      postId: data._id
    });
  });

});

app.get('/api/posts', (req, res, next) => {
  Post.find().then((data) => {
    res.status(200).json({
      message: 'Successfully fetched posts',
      posts: data
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((data) => {
    res.status(200).json({
      message: 'Successfully deleted post'
    });
  });

})

module.exports = app;
