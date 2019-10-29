const Region = require('../model/regionModel');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (error) => {
    if (error) console.log('몽고디비 연결 에러', error);
    else console.log('몽고디비 연결 성공');
});
(async function main() {
    let query = [
        {name: '안후이성'},
        {name: '허난성'},
        {name: '칭하이성'},
        {name: '푸젠성'},
        {name: '후베이성'},
        {name: '산시성'},
        {name: '간쑤성'},
        {name: '후난성'},
        {name: '산둥성'},
        {name: '구이저우성'},
        {name: '장쑤성'},
        {name: '산시성'},
        {name: '하이난성'},
        {name: '장시성'},
        {name: '쓰촨성'},
        {name: '허베이성'},
        {name: '지린성'},
        {name: '원난성'},
        {name: '헤이룽장성'},
        {name: '랴오닝성'},
        {name: '저장성'}
    ];
    await Region.deleteMany({});
    await Region.insertMany(query);
})();