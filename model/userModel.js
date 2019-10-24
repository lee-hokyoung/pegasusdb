const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 회원 스키마
const userSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    user_no: {type: String, required: true, unique: true},
    user_corp: {type: String, required:true},
    manager_name: {type: String, required:true},
    manager_tel: {type:String, required:true},
    email: {type: String},
    user_id: {type:String, required:true, unique:true},
    user_pw: {type:String, required:true},
    category:{type:Array, ref:'Category'},
    created: {type: Date, default: Date.now},
});
module.exports = mongoose.model('User', userSchema);