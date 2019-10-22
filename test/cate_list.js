const Category = require('../model/categoryModel');

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (error) => {
    if (error) console.log('몽고디비 연결 에러', error);
    else console.log('몽고디비 연결 성공');
});
(async function main() {
    let list = await Category.aggregate([
        {$group:{_id:'$group_id'}}
    ]);
    console.log('list : ', list);
})();