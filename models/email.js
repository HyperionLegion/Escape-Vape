const mongoose = require('mongoose');
//user schema
const EmailSchema = mongoose.Schema({
	userid:{
		type:String,
		required:true
	},
	email:{
		type: String,
		required: true
	}
});

const Email = module.exports = mongoose.model('email', EmailSchema);