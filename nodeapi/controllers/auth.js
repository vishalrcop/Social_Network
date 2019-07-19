const jwt = require('jsonWebToken');
require("dotenv").config();
const expressJwt = require('express-jwt');
const User = require('../models/user');
//hello

exports.signup = async (req,res) =>{
	const userExist = await User.findOne({email: req.body.email});
	if(userExist){
		return res.status(403).json({error: "Email is taken!"});
	}
	const user = await new User(req.body);
	await user.save();
	res.json({message : 'Signup successful!!!!'});
};

exports.signin = (req,res) => {
	// find the user based email
	const {email, password} = req.body;

	User.findOne({email}, (error, user) => {
		
		//if error or no user
		if(error || !user){
			return res.status(401).json({
				error : 'User with that email does not exist. Please signup.'
			});
		}	

		//if user is found make sure email and password match
		//create authenticate model and use it here
		if(!user.authenticate(password)){
			return res.status(401).json({
				error : 'Email and password do not match'
			});			
		}
		
		//generate a token with user id and secret
		const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
		
		//persist he token as 't' in cookie with expiry date
		res.cookie("t", token, {expiry: new Date() + 9999})
		
		//return response with user and token to frontend client
		const{ _id, name, email} = user;
		return res.json({token, user: { _id, email, name}});
	})
};

exports.signout = (req,res) => {
	res.clearCookie("t");
	return res.json({message : 'Signout successful'});
};


exports.requireSignin = expressJwt({
	//if the token is valid, express jwt appends the varified users id
	//in an auth key to the request object. 
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});
