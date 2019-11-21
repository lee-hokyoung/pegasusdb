const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
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
    status:{type:Number, default:1},
    category:{type:Array, ref:'Category'},
    created: {type: Date, default: Date.now},
    lv:{type:Number, default:1},
    admin:{typ:Boolean, default:false},
    tokens: String
});
// User Id로 찾기
userSchema.statics.findOneByUserId = function(userId){
    return this.findOne({userId}).exec();
};
// User pwd 검증
userSchema.methods.verify = function(user_pw){
    return this.user_pw === user_pw
};
userSchema.methods.assignAdmin = function(){
    this.admin = true;
    return this.save();
};
userSchema.methods.generateAuthToken = async () => {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};
// userSchema.statics.findByCredentials = async (user_id, user_pw) => {
//     // Search for a user by email and password.
//     const user = await this.findOne({user_id});
//     if (!user) {
//         throw new Error({error:'Invalid login credentials'});
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password)
//     if (!isPasswordMatch) {
//         throw new Error({ error: 'Invalid login credentials' })
//     }
//     return user
// }
module.exports = mongoose.model('User', userSchema);