const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post was successfully added.'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: '001',
      title: 'First server-side post',
      content: 'Coming from server'
    },
    {
      id: '002',
      title: 'Second server-side post',
      content: 'Coming from server'
    },
    {
      id: '003',
      title: 'Third server-side post',
      content: 'Coming from server'
    }
  ];

  res.status(200).json({
    message: 'Successfully fetched posts',
    posts: posts
  });
});

module.exports = app;
