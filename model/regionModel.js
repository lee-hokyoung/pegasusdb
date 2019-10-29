const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 지역 스키마
const regionSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name:{type:String, required:true},
});
module.exports = mongoose.model('Region', regionSchema);