const City = require('../model/cityModel');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (error) => {
    if (error) console.log('몽고디비 연결 에러', error);
    else console.log('몽고디비 연결 성공');
});
(async function main() {
    let query = [
        {name: '베이징'},
        {name: '청두'},
        {name: '장사'},
        {name: '상하이'},
        {name: '항저우'},
        {name: '선양'},
        {name: '광저우'},
        {name: '우한'},
        {name: '칭다오'},
        {name: '선전'},
        {name: '충칭'},
        {name: '정저우'},
        {name: '난징'},
        {name: '다렌'},
        {name: '홍콩'},
        {name: '텐진'},
        {name: '동관'},
        {name: '마카오'},
        {name: '쑤저우'},
        {name: '닝보'},
        {name: '대만'},
        {name: '시안'},
        {name: '충칭'}
    ];
    await City.deleteMany({});
    await City.insertMany(query);
    console.log('insert complete');
})();