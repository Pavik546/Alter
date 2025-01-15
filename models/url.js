var mongoose = require('mongoose');

var UrlSchema=new mongoose.Schema({
	
	LongUrl:{ type: String},
  ShortUrl:{ type: String},
  Alias:{ type: String},
  Topic:{ type: String},
  Created_by:{type:String}
  
	
},
{
  timestamps: { createdAt: 'createdOn' , updatedAt: 'updatedOn' }
});


const Url = mongoose.model('Url', UrlSchema);

module.exports = Url;