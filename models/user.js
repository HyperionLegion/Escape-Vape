const mongoose = require('mongoose');
//user schema
const UserSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	date:{
		type: Date,
		required: true
	},
	days:{
		type: Number,
		required: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);