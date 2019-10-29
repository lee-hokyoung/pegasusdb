const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 도시 스키마
const citySchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name:{type:String, required:true},
});
module.exports = mongoose.model('City', citySchema);