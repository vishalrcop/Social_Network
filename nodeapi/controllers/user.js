const _ = require('lodash');
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');

exports.userById = (req, res, next, id) =>{
	User.findById(id).exec((err, user) =>{
		if(err || !user)
		{
			return res.status(400).json({
				error: "User not found"
			})
		};
		req.profile = user; //add profile object in req with user info
		next();
	});
};

exports.hasAuthorization = (req,res,next) => {
	const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
	if(!authorized){
		return res.status(403).json({
			error: "User is not authorized to perform his action"
		});
	} 
};

exports.allUsers = (req,res) => {
	User.find((err,users) => {
		if(err)
		{
			return res.status(400).json({error: err});
		}
		res.json(users);
	}).select("name email created updated");
};

exports.getUser = (req,res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

// exports.updateUser = (req,res) => {
// 	let user = req.profile;
// 	user = _.extend(user, req.body); //extend - mutate the source object
// 	user.update = Date.now();
// 	user.save((err) => {
// 		if(err)
// 		{
// 			return res.status(400).json({
// 				error: "you are no authorized to perform this operation.."
// 			});
// 		}
// 		user.hashed_password = undefined;
// 		user.salt = undefined;
// 		res.json({user});
// 	});
// };

exports.updateUser = (req,res,next) => {

	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err,fields,files) => {
		if(err){
			return res.status(400).json({
				error:"Photo could not be uploaded"
			})
		}
		//save user
		let user=req.profile;
		user= _.extend(user, fields);
		user.updated = Date.now();

		if(files.photo){
			user.photo.data = fs.readFileSync(files.photo.path);
			user.photo.contentType = files.photo.type;
		}

		user.save((err,result) => {
			if(err){
				return res.status(400).json({
					error:err
				});
			}
			user.hashed_password = undefined;
			user.salt = undefined;
			res.json(user);
		});
	});
};

exports.deleteUser = (req,res) => {
	let user = req.profile;
	user.remove((err, user) => {
		if(err)
		{
			return res.status(400).json({
				error:err
			});
		}
		res.json({message:"your account has been deleted successfully"});		
	});
};






