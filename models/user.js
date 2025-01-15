var mongoose = require('mongoose');

var UserSchema=new mongoose.Schema({

	user_id:{ type: String, required: true },
    user_name:{ type: String, required: true },
    user_email:{ type: String, required: true },
	
	
},
{
  timestamps: { createdAt: 'createdOn' , updatedAt: 'updatedOn' }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;