const express = require('express');
const router = express.Router();
const dataModel = require('../model/dataModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const categoryModel = require('../model/categoryModel');
const configModel = require('../model/configModel');

// main 화면
router.get('/:cate_id/:cate_item/:id', async (req, res) => {
  let cate_info = await categoryModel.find({group_id:req.params.cate_id});
  let data = await dataModel.findOne({_id:new ObjectId(req.params.id)});
  let config = await configModel.findOne({});
  let user = req.user;
  res.render('detail', {
    data: data,
    cate_info:cate_info,
    config:config,
    user:user,
    cate_item:req.params.cate_item
  });
});
module.exports = router;