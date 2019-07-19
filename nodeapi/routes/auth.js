const express = require('express');
const router = express.Router();
const { userSignupValidator } = require('../validator');
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

//any route containing :userId, our app will first execute userById 
router.param("userID", userById);

module.exports = router;