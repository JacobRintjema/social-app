const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  post.save().then(data => {
    res.status(201).json({
      message: 'Post was successfully added.',
      post: {
        ...data,
        id: data._id,
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Could not create new post"
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post was successfully updated.'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized to update post.'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not update post"
    })
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currPage) {
    postQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
  }

  postQuery.then((data) => {
    fetchedPosts = data;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Successfully fetched posts',
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: "Could not fetch new posts"
    })
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not fetch new post"
    })
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then((data) => {
    if (data.n > 0) {
      res.status(200).json({
        message: 'Successfully deleted post'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized to delete post.'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not delete post"
    })
  });
};
