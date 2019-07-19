const express = require('express');
const router = express.Router();
const { requireSignin } = require("../controllers/auth");
const { userById, allUsers, getUser, updateUser, deleteUser } = require("../controllers/user");

router.get("/users", allUsers);
router.get("/user/:userID", requireSignin, getUser);
router.put("/user/:userID", requireSignin, updateUser);
router.delete("/user/:userID", requireSignin, deleteUser);
//any route containing :userId, our app will first execute userById 
router.param("userID", userById);

module.exports = router;