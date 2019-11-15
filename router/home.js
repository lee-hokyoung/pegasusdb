const express = require('express');
const router = express.Router();
const dataModel = require('../model/dataModel');
const categoryModel = require('../model/categoryModel');
const regionModel = require('../model/regionModel');
const cityModel = require('../model/cityModel');
const middle = require('./middlewares');

let obj = [
  {name: 'Industry'},
  {name: 'Market'},
  {name: 'Consumer'},
  {name: 'Company'}
];

// main 화면
router.get('', middle.isLoggedIn, async (req, res) => {
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: {id: '$group_id', name: '$group_name'}
        , group_order: {$first: '$group_order'}
        , list: {$push: '$$ROOT'}
      }
    },
    {$sort: {group_order: 1}}
  ]);
  res.render('home', {
    category: category
  });
});
// list 화면
router.get('/list/:cate/:cate_item?', middle.isLoggedIn, async (req, res) => {
  let strQuery = req.query;
  let cate = req.params.cate;
  let cate_item = req.params.cate_item;
  let cate_list = await categoryModel.find({group_id: cate});
  let region_list = await regionModel.find({});
  let city_list = await cityModel.find({});
  let list = await fnGetList(strQuery, req.params);

  console.log('str query : ', strQuery);
  res.render('list', {
    cate: cate,
    cate_item:cate_item,
    list: list,
    cate_list: cate_list,
    region_list: region_list,
    city_list: city_list,
    object: obj,
    strQuery: strQuery,
  });
});
// get by ajax
router.get('/ajax/list/:cate/:cate_item?', middle.isLoggedIn, async (req, res) => {
  let strQuery = req.query;
  let list = await fnGetList(strQuery, req.params);
  res.json({list:list, cate:req.params.cate, cate_item:req.params.cate_item});
});
const fnGetList = async(strQuery, params) => {
  let query_match = [{}];
  let cate = params.cate;
  let cate_item = params.cate_item;
  let cate_info = await categoryModel.findOne({cate_id:cate_item});
  console.log('cate_info : ', cate_info);
  let cate_obj = {};
  cate_obj['category_obj.' + cate + '.' + cate_item] = cate_info.cate_name;
  let unwind_query = {'$unwind':'$category_obj.' + cate};
  let cate_query = {$match:cate_obj};
  if(Object.keys(strQuery).length > 0){
    query_match = Object.keys(strQuery).map(function(key){
      if(key === 'region'){
        return {'$or':[
            {'$expr':{'$gt':[{'$indexOfArray':['$region_array', strQuery[key]]}, -1]}},
            {'$expr':{'$gt':[{'$indexOfArray':['$city_array', strQuery[key]]}, -1]}}
          ]
        }
      }else if(key === 'object'){
        return {'$expr':{'$gt':[{'$indexOfArray':['$object', strQuery[key]]}, -1]}};
      }
    });
  }
  console.log('query : ', query_match);
  return await dataModel.aggregate([
    unwind_query, cate_query,
    {
      $match: {
        $and:query_match
      }
    }
  ]);
};
module.exports = router;