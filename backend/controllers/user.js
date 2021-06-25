const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require('../models/post');
let storedUser;

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials"
        });
      });
  });
};

exports.userLogin = (req, res, next) => {

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Authentication Failed'
      });
    }

    storedUser = user;

    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Authentication Failed'
      });
    }

    const token = jwt.sign(
      {
        email: storedUser.email,
        userId: storedUser._id,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        password: storedUser.password
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: storedUser._id
    })

  }).catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials"
    });
  });
};

exports.getUser = (req, res, next) => {
  User.findOne({_id: req.params.id}).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not fetch new user"
    })
  });

};

exports.updateUser = (req, res, next) => {
  let author = req.body.firstName + " " + req.body.lastName;

  // Update user account
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      _id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash
    });

    User.updateOne({
      _id: req.params.id
    }, user).then(result => {

      if (result.n > 0) {
        // Update user post
        Post.updateMany({
          creator: req.params.id
        }, { $set: { author: author } } ).then(result => {
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
        /*
        res.status(200).json({
          message: 'User was successfully updated.'
        });
        */
      } else {
        res.status(401).json({
          message: 'Not authorized to update user.'
        });
      }
    }).catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: "Could not update user"
      })
    });
  });
};
