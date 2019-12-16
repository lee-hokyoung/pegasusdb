const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 데이터 스키마
const dataSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  data_title:{type:String},
  data_unit:{type:String},
  chart_type:{type:String},
  table_x:{type:Object},
  table_y:{type:Object},
  data_no:{type:String, unique:true},
  category_obj:{type:Object, required:true},
  region_array:{type:Array, required:true},
  city_array:{type:Array, required:true},
  object:{type:Array, required:true},
  description:{type:String},
  source:{type:String},
  status:{type:Number, default:1}, // 1: 제공, 2: 중지, 9:삭제
  // files
  add_img_graph:{
    original:String,
    path:String
  },
  add_pdf:{
    original:String,
    path:String
  },
  add_xls:{
    original:String,
    path:String
  },
  add_ppt:{
    original:String,
    path:String
  },
  add_png:{
    original:String,
    path:String
  },
  created:{type:Date, default:Date.now()},
  updated:{type:Date, default:Date.now()}
});
module.exports = mongoose.model('Data', dataSchema);