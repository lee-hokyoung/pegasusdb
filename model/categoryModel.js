const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 카테고리 스키마
const cateSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    cate_id:{type:String, required:true, unique: true},
    cate_name:{type:String, required:true},
    group_id: {type: String, required:true},
    group_name: {type: String, required: true},
    status:{type:Number, default:1},
    created: {type: Date, default: Date.now},
});
module.exports = mongoose.model('Category', cateSchema);