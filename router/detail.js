const express = require('express');
const router = express.Router();
const dataModel = require('../model/dataModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const categoryModel = require('../model/categoryModel');
const configModel = require('../model/configModel');

// main 화면
router.get('/:cate_id/:id', async (req, res) => {
  let cate_info = await categoryModel.find({group_id:req.params.cate_id});
  let data = await dataModel.findOne({_id:new ObjectId(req.params.id)});
  let config = await configModel.findOne({});
  // let data = await dataModel.aggregate([
  //   {$match: {_id: new ObjectId(req.params.id)}},
  //   {
  //     $lookup: {
  //       from:'categories',
  //       let:{
  //         ref_id:'$cate_id',
  //       },
  //       pipeline:[
  //         {
  //           $match: {
  //             $expr: {$eq: ['$cate_id', '$$ref_id']},
  //           }
  //         }
  //       ],
  //       as:'cate'
  //     }
  //   }
  // ]);
  // let data = await dataModel.findOne({_id: new ObjectId(req.params.id)});
  // let data = {
  //     id:1,
  //     dataNo:'A7777',
  //     cate:'Beauty',
  //     sub_cate:'Hair Salon',
  //     title:'중국 허난성 지역 내 헤어 미용실 수 2019',
  //     chart:{
  //         type:'bar',
  //         data:[
  //             {x:'2015', y:150},
  //             {x:'2016', y:170},
  //             {x:'2017', y:190},
  //             {x:'2018', y:210},
  //             {x:'2019', y:200},
  //         ]
  //     },
  //     desc:`중국 허난성 푸양시의 헤어살롱 업체는 2015년 이후로, 지속적인 성장을 보이고 있으며, 전년대비 15.3%의 성장률을 나타내고 있다.`,
  //     source:`www.zhupao.co.kr 홈페이지 내 'ABC보고서' 페이지 21에서 발췌`
  // };
  res.render('detail', {
    data: data,
    cate_info:cate_info,
    config:config
  });
});
module.exports = router;