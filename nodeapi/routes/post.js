const express = require('express');
const router = express.Router();
const validator = require('../validator');
const { getPosts, createPost} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

router.get("/", getPosts);
router.post("/post", requireSignin, validator.createPostValidator, createPost);

//any route containing :userId, our app will first execute userById 
router.param("userID", userById);

module.exports = router;