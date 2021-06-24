const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const auth = require('../middleware/check-auth');

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get('/profile/:id', UserController.getUser);

router.put('/profile/:id', auth, UserController.updateUser);

module.exports = router;
