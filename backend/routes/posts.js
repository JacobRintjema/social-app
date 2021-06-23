const express = require('express');
const auth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');
const router = express.Router();
const extractFile = require('../middleware/file');

router.post('', auth, extractFile, PostController.createPost);

router.put('/:id', auth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', auth, PostController.deletePost);

module.exports = router;
