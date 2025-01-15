var mongoose = require('mongoose');

var AnalyticSchema=new mongoose.Schema({
    user_id:{type: String},
    IP_address:{ type: String},
    GeoLocation:{ type: String},
    OperatingSystem:{ type: String},
    DeviceType:{ type: String},
    Alias:{ type: String},
    Topic:{ type: String},
    Count:{ type: Number,default:0},    
},
{
  timestamps: { createdAt: 'createdOn' , updatedAt: 'updatedOn' }
});


const Analytic = mongoose.model('Analytic', AnalyticSchema);

module.exports = Analytic;