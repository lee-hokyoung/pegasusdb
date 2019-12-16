const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel');
const categoryModel = require('../model/categoryModel');
const regionModel = require('../model/regionModel');
const cityModel = require('../model/cityModel');
const dataModel = require('../model/dataModel');
const mongoose = require('mongoose');
const configModel = require('../model/configModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
// 사용자 등록 화면
router.get('/user/register', async (req, res) => {
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
  let user = req.user;
  res.render('admin_user_register', {
    category: category,
    active: 'user_register',
    user: user
  });
});
// 사용자 등록
router.post('/user/register', async (req, res) => {
  let exUser = await userModel.findOne({user_id: req.body.user_id});
  let exUserNo = await userModel.findOne({user_no: req.body.user_no});
  if (exUser) {
    res.json({result: 2, message: '이미 등록된 ID가 있습니다.'});
  } else if (exUserNo) {
    res.json({result: 3, message: '이미 등록된 고객번호가 있습니다.'});
  } else {
    await userModel.create(req.body);
    res.json({result: 1, message: '정상적으로 등록되었습니다.'});
  }
});
// 사용자 관리
router.get('/user/list', async (req, res) => {
  let user = req.user;
  let users = await userModel.aggregate([
    {$match: {lv: 1}},
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
    active: 'user_list',
    user: user
  })
});
// 사용자 조회
router.post('/user/search', async (req, res) => {
  let regex = {$regex: '.*' + req.body.searchText + '.*'};
  let list = await userModel.aggregate([
    {
      $match: {
        $and:[
          {lv:1},
          {
            $or: [
              {user_id: regex},
              {user_corp: regex},
              {manager_name: regex},
              {manager_tel: regex}
            ]
          }
        ],
      }
    },
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
// 사용자 상태 변경
router.post('/user/status', async (req, res) => {
  let id = req.body.id;
  let status = req.body.status;
  let result = await userModel.updateOne({_id: mongoose.Types.ObjectId(id)}, {$set: {status: status}});
  res.json(result);
});
// 데이터 등록 화면
router.get('/data/register', async (req, res) => {
  let user = req.user;
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
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render('admin_data_register', {
    active: 'data_register',
    category: category,
    region: region,
    city: city,
    obj: obj,
    user: user
  });
});
// 데이터 등록
router.post('/data/register', async (req, res) => {
  // temp 폴더 내에 모든 파일을 삭제
  if (typeof req.body.files !== 'undefined') {
    // path 에 올라온 파일들을 downloads 파일로 복사
    let uploaded_files = req.body.files.path;
    uploaded_files.forEach(function (v) {
      fs.createReadStream('./' + v)
        .pipe(fs.createWriteStream('./downloads' + v.replace('temps', '')));
    });
    console.log('files : ', req.body.files);
    let directory = './temps';
    fs.readdir(directory, (err, files) => {
      if (!err) {
        try {
          console.log('files : ', files);
          for (let file of files) {
            if (uploaded_files.indexOf(file) === -1)
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  let data = req.body;
  console.log('data : ', data);
  let result = await dataModel.create(data);
  res.json(result);
});
// 데이터 리스트
router.get('/data/list', async (req, res) => {
  let user = req.user;
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
    list: list,
    user: user
  });
});
// 데이터 삭제
router.delete('/data/:id', async (req, res) => {
  // 데이터 내에 첨부 파일 경로 찾아서 삭제하기
  let data = await dataModel.findOne({_id: req.params.id});
  if (data.add_img_graph) fs.unlink('./downloads/' + data.add_img_graph, err => {
    if (err) throw err;
  });
  if (data.add_pdf) fs.unlink('./downloads/' + data.add_pdf, err => {
    if (err) throw err;
  });
  if (data.add_png) fs.unlink('./downloads/' + data.add_png, err => {
    if (err) throw err;
  });
  if (data.add_ppt) fs.unlink('./downloads/' + data.add_ppt, err => {
    if (err) throw err;
  });
  if (data.add_xls) fs.unlink('./downloads/' + data.add_xls, err => {
    if (err) throw err;
  });

  let result = await dataModel.deleteOne({_id: req.params.id});
  res.json(result);
});
// 데이터 read
router.get('/data/read/:id', async (req, res) => {
  let user = req.user;
  let doc = await dataModel.findOne({_id: req.params.id});
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
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render('admin_data_read', {
    doc: doc,
    category: category,
    region: region,
    city: city,
    obj: obj,
    user: user
  });
});
// 데이터 update
router.put('/data/update/:id', async (req, res) => {
  let result = await dataModel.updateMany({_id: req.params.id}, req.body);
  res.json(result);
});
// 데이터 검색
router.post('/data/search', async (req, res) => {
  let regex = {$regex: '.*' + req.body.searchText + '.*'};
  let list = await dataModel.aggregate([
    {
      $match: {
        $or: [
          {data_no:regex},
          {data_title:regex}
        ]
      }
    }
  ]);
  res.json(list);
});
// 파일 upload
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './temps');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    }
  }),
  limits: {fileSize: 2 * 1024 * 1024}
});
router.post('/data/file_upload', upload.array('file', 10), async (req, res) => {
  let files = await req.files;
  res.json(files);
});
// 환경설정 (Set-up)
router.get('/config', async (req, res) => {
  let data = await configModel.findOne({});
  let user = req.user;
  res.render('admin_config', {
    active: 'config',
    data: data,
    user: user
  });
});
router.post('/config', async (req, res) => {
  let result = await configModel.findOneAndUpdate({}, {$set: req.body}, {upsert: true});
  res.json({result: result, code: 1})
});
module.exports = router;
