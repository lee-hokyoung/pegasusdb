const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 데이터 스키마
const dataSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  data_title:{type:String, required:true},
  data_unit:{type:String, required:true},
  chart_type:{type:String, required:true},
  table_obj:{type:Object, required:true},
  data_no:{type:String, required:true, unique:true},
  category_obj:{type:Object, required:true},
  region_array:{type:Array, required:true},
  city_array:{type:Array, required:true},
  object:{type:Array, required:true},
  description:{type:String},
  source:{type:String},
  status:{type:Number, default:1}, // 1: 제공, 2: 중지, 9:삭제
  created:{type:Date, default:Date.now()},
  updated:{type:Date, default:Date.now()}
});
module.exports = mongoose.model('Data', dataSchema);