const express = require('express');

const router = express.Router();
const Post = require('../models/post');

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({
      message: 'Post was successfully updated.'
    });
  });
});

router.get('', (req, res, next) => {
  Post.find().then((data) => {
    res.status(200).json({
      message: 'Successfully fetched posts',
      posts: data
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  })
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((data) => {
    res.status(200).json({
      message: 'Successfully deleted post'
    });
  });

});

module.exports = router;
