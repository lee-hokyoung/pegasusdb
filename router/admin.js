const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel');
const categoryModel = require('../model/categoryModel');
const regionModel = require('../model/regionModel');
const cityModel = require('../model/cityModel');
const dataModel = require('../model/dataModel');
// 사용자 등록
let category = [
  {
    cate: 'Beauty',
    sub_cate: ['Hair Salon', 'SPA', 'Nail Shop']
  },
  {
    cate: 'O2O',
    sub_cate: ['Hotel', 'Delivery', 'Sharing']
  },
  {
    cate: 'Health',
    sub_cate: ['Health care & Support', 'Silver care & Support', 'Baby care & Support']
  },
  {
    cate: 'Transport',
    sub_cate: ['Electronic Vehicles', 'Drone', 'Smart Mobility']
  },
  {
    cate: 'Food & Beverage',
    sub_cate: ['Restaurant', 'Cafe', 'Franchise']
  },
  {
    cate: 'E-Commerce',
    sub_cate: ['B2B Commerce', 'B2C Commerce', 'C2C Commerce']
  }
];
let province = [
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
let city = [
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
  {name: '충칭'},
];
let obj = [
  {name: 'Industry'},
  {name: 'Market'},
  {name: 'Consumer'},
  {name: 'Company'}
];
router.get('/user/register', async (req, res) => {
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: {id: '$group_id', name: '$group_name'}
        , group_order: {$first: '$group_order'}
        , list: {$push: '$$ROOT'}
      }
    },
    {$sort:{group_order:1}}
  ]);
  res.render('admin_user_register', {
    category: category,
    active: 'user_register'
  });
});
router.post('/user/register', async (req, res) => {
  let exUser = await userModel.findOne({user_id:req.body.user_id});
  let exUserNo = await userModel.findOne({user_no:req.body.user_no});
  if(exUser){
    res.json({result:2, message:'이미 등록된 ID가 있습니다.'});
  }else if(exUserNo){
    res.json({result:3, message:'이미 등록된 고객번호가 있습니다.'});
  }else{
    await userModel.create(req.body);
    res.json({result:1, message:'정상적으로 등록되었습니다.'});
  }
});
// 사용자 관리
router.get('/user/list', async (req, res) => {
  let users = await userModel.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: 'cate_id',
        as: 'cate_info'
      }
    }
  ]);
  res.render('admin_user_list', {
    users: users,
    active: 'user_list'
  })
});
// 사용자 조회
router.post('/user/search', async(req, res) => {
  console.log('body : ', req.body);
  let regex = {$regex:'.*' + req.body.manager_name + '.*'};
  console.log('regex : ', regex);
  let list = await userModel.aggregate([
    {$match:{manager_name:regex}},
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: 'cate_id',
        as: 'cate_info'
      }
    }
  ]);
  res.json(list);
});

// 데이터 등록 화면
router.get('/data/register', async (req, res) => {
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: {id: '$group_id', name: '$group_name'}
        , group_order: {$first: '$group_order'}
        , list: {$push: '$$ROOT'}
      }
    },
    {$sort:{group_order:1}}
  ]);
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render('admin_data_register', {
    active: 'data_register',
    category: category,
    region: region,
    city: city,
    obj: obj
  });
});
// 데이터 등록
router.post('/data/register', async (req, res)=>{
  let data = req.body;
  let result = await dataModel.create(data);
  res.json(result);
});
// 데이터 리스트
router.get('/data/list', async (req, res) => {
  let data = [
    {
      id: 'A7777', title: '중국 허난성 지역 내 헤어 미용실 수 2019', unit: '개',
      category: 'Hair Salon', region: 'Henan', obj: 'company', status: 1,
      updated_data: '2019.09.29'
    },
    {
      id: 'A7778', title: '중국 베이징 지역 내 헤어 미용실 수 2019', unit: '개',
      category: 'Hair Salon', region: 'Beijing', obj: 'company', status: 1,
      updated_data: '2019.09.29'
    }
  ];
  let list = await dataModel.find({});
  res.render('admin_data_list', {
    active: 'data_list',
    data: data,
    list:list
  });
});
// 데이터 삭제
router.delete('/data/:id', async(req, res) => {
  let result = await dataModel.deleteOne({_id:req.params.id});
  res.json(result);
});
// 데이터 read
router.get('/data/read/:id', async(req, res)=>{
  let doc = await dataModel.findOne({_id:req.params.id});
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: {id: '$group_id', name: '$group_name'}
        , group_order: {$first: '$group_order'}
        , list: {$push: '$$ROOT'}
      }
    },
    {$sort:{group_order:1}}
  ]);
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render('admin_data_read', {
    doc:doc,
    category:category,
    region:region,
    city:city,
    obj:obj
  });
});
// 데이터 update
router.put('/data/update/:id', async(req, res) => {
  let result = await dataModel.updateMany({_id:req.params.id}, req.body);
  res.json(result);
});
// 환경설정 (Set-up)
router.get('/config', (req, res) => {
  res.render('admin_config', {
    active: 'config'
  });
});
module.exports = router;
