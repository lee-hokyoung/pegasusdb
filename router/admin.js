const express = require("express");
const router = express.Router();
const userModel = require("../model/userModel");
const categoryModel = require("../model/categoryModel");
const regionModel = require("../model/regionModel");
const cityModel = require("../model/cityModel");
const dataModel = require("../model/dataModel");
const mongoose = require("mongoose");
const configModel = require("../model/configModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 사용자 등록
let category = [
  {
    cate: "Beauty",
    sub_cate: ["Hair Salon", "SPA", "Nail Shop"]
  },
  {
    cate: "Living",
    sub_cate: ["Infortainment", "Home appliances", "Interior"]
  },
  {
    cate: "Health",
    sub_cate: [
      "Adult care & Support",
      "Silver care & Support",
      "Baby care & Support"
    ]
  },
  {
    cate: "Transport",
    sub_cate: ["Smart Mobility", "Drone", "Public Transportation"]
  },
  {
    cate: "Food & Beverage",
    sub_cate: ["Restaurant & Cafe", "Delivery", "Franchise"]
  },
  {
    cate: "E-Commerce",
    sub_cate: ["PC & Mobile shopping", "Consumer", "Producer"]
  }
];
let obj = [
  { name: "Industry" },
  { name: "Market" },
  { name: "Consumer" },
  { name: "Company" }
];
// 사용자 등록 화면
router.get("/user/register", async (req, res) => {
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: { id: "$group_id", name: "$group_name" },
        group_order: { $first: "$group_order" },
        list: { $push: "$$ROOT" }
      }
    },
    { $sort: { group_order: 1 } }
  ]);
  let user = req.user;
  res.render("admin_user_register", {
    category: category,
    active: "user_register",
    user: user
  });
});
// 사용자 등록
router.post("/user/register", async (req, res) => {
  let exUser = await userModel.findOne({ user_id: req.body.user_id });
  let exUserNo = await userModel.findOne({ user_no: req.body.user_no });
  if (exUser) {
    res.json({ result: 2, message: "이미 등록된 ID가 있습니다." });
  } else if (exUserNo) {
    res.json({ result: 3, message: "이미 등록된 고객번호가 있습니다." });
  } else {
    await userModel.create(req.body);
    res.json({ result: 1, message: "정상적으로 등록되었습니다." });
  }
});
// 사용자 관리
router.get("/user/list", async (req, res) => {
  let user = req.user;
  let users = await userModel.aggregate([
    { $match: { lv: 1 } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "cate_id",
        as: "cate_info"
      }
    }
  ]);
  res.render("admin_user_list", {
    users: users,
    active: "user_list",
    user: user
  });
});
// 사용자 조회
router.post("/user/search", async (req, res) => {
  let regex = { $regex: ".*" + req.body.searchText + ".*" };
  let list = await userModel.aggregate([
    {
      $match: {
        $and: [
          { lv: 1 },
          {
            $or: [
              { user_id: regex },
              { user_corp: regex },
              { manager_name: regex },
              { manager_tel: regex }
            ]
          }
        ]
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "cate_id",
        as: "cate_info"
      }
    }
  ]);
  res.json(list);
});
// 사용자 상태 변경
router.post("/user/status", async (req, res) => {
  let id = req.body.id;
  let status = req.body.status;
  let result = await userModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    { $set: { status: status } }
  );
  res.json(result);
});
// 데이터 등록 화면
router.get("/data/register", async (req, res) => {
  let user = req.user;
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: { id: "$group_id", name: "$group_name" },
        group_order: { $first: "$group_order" },
        list: { $push: "$$ROOT" }
      }
    },
    { $sort: { group_order: 1 } }
  ]);
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render("admin_data_register", {
    active: "data_register",
    category: category,
    region: region,
    city: city,
    obj: obj,
    user: user
  });
});
function fnMoveFileTempToDownload(req) {
  if (
    typeof req.body.add_img_graph !== "undefined" &&
    req.body.add_img_graph !== ""
  ) {
    let path = req.body.add_img_graph.path;
    fs.createReadStream("./" + path).pipe(
      fs.createWriteStream("./downloads" + path.replace("temps", ""))
    );
  }
  if (typeof req.body.add_pdf !== "undefined" && req.body.add_pdf !== "") {
    let path = req.body.add_pdf.path;
    fs.createReadStream("./" + path).pipe(
      fs.createWriteStream("./downloads" + path.replace("temps", ""))
    );
  }
  if (typeof req.body.add_xls !== "undefined" && req.body.add_xls !== "") {
    let path = req.body.add_xls.path;
    fs.createReadStream("./" + path).pipe(
      fs.createWriteStream("./downloads" + path.replace("temps", ""))
    );
  }
  if (typeof req.body.add_ppt !== "undefined" && req.body.add_ppt !== "") {
    let path = req.body.add_ppt.path;
    fs.createReadStream("./" + path).pipe(
      fs.createWriteStream("./downloads" + path.replace("temps", ""))
    );
  }
  if (typeof req.body.add_png !== "undefined" && req.body.add_png !== "") {
    let path = req.body.add_png.path;
    fs.createReadStream("./" + path).pipe(
      fs.createWriteStream("./downloads" + path.replace("temps", ""))
    );
  }
  // temp 폴더 내에 모든 파일을 삭제
  let directory = "./temps";
  fs.readdir(directory, (err, files) => {
    if (!err) {
      try {
        for (let file of files) {
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
// 데이터 등록
router.post("/data/register", async (req, res) => {
  // 유효성 검증
  let exDataNo = await dataModel.findOne({ data_no: req.body.data_no });
  if (exDataNo) {
    res.json({ code: 9, message: "중복된 자료번호 입니다." });
  } else {
    fnMoveFileTempToDownload(req);
    let data = req.body;
    let result = await dataModel.create(data);
    res.json({ result: result, code: 0 });
  }
});
// 데이터 대량 등록 화면
router.get("/data/register_all", async (req, res) => {
  res.render("admin_data_register_all", {
    user: req.user
  });
});
// 데이터 리스트 화면
router.get("/data/list", async (req, res) => {
  let user = req.user;
  let data = [
    {
      id: "A7777",
      title: "중국 허난성 지역 내 헤어 미용실 수 2019",
      unit: "개",
      category: "Hair Salon",
      region: "Henan",
      obj: "company",
      status: 1,
      updated_data: "2019.09.29"
    },
    {
      id: "A7778",
      title: "중국 베이징 지역 내 헤어 미용실 수 2019",
      unit: "개",
      category: "Hair Salon",
      region: "Beijing",
      obj: "company",
      status: 1,
      updated_data: "2019.09.29"
    }
  ];
  let list = await dataModel.find({});
  res.render("admin_data_list", {
    active: "data_list",
    data: data,
    list: list,
    user: user
  });
});
// 데이터 삭제
router.delete("/data/:id", async (req, res) => {
  // 데이터 내에 첨부 파일 경로 찾아서 삭제하기
  let data = await dataModel.findOne({ _id: req.params.id });
  if (data) {
    if (data.add_img_graph.path) {
      try {
        let path =
          "./downloads/" + data.add_img_graph.path.replace("temps/", "");
        if (fs.existsSync(path)) {
          fs.unlink(path, err => {
            if (err) throw err;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (data.add_pdf.path) {
      try {
        let path = "./downloads/" + data.add_pdf.path.replace("temps/", "");
        if (fs.existsSync(path)) {
          fs.unlink(path, err => {
            if (err) throw err;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (data.add_png.path) {
      try {
        let path = "./downloads/" + data.add_png.path.replace("temps/", "");
        if (fs.existsSync(path)) {
          fs.unlink(path, err => {
            if (err) throw err;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (data.add_ppt.path) {
      try {
        let path = "./downloads/" + data.add_ppt.path.replcae("temps/", "");
        if (fs.existsSync(path)) {
          fs.unlink(path, err => {
            if (err) throw err;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (data.add_xls.path) {
      try {
        let path = "./downloads/" + data.add_xls.path.replace("temps/", "");
        if (fs.existsSync(path)) {
          fs.unlink(path, err => {
            if (err) throw err;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  let result = await dataModel.deleteOne({ _id: req.params.id });
  res.json(result);
});
// 데이터 read
router.get("/data/read/:id", async (req, res) => {
  let user = req.user;
  let doc = await dataModel.findOne({ _id: req.params.id });
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: { id: "$group_id", name: "$group_name" },
        group_order: { $first: "$group_order" },
        list: { $push: "$$ROOT" }
      }
    },
    { $sort: { group_order: 1 } }
  ]);
  let region = await regionModel.find({});
  let city = await cityModel.find({});
  res.render("admin_data_read", {
    doc: doc,
    category: category,
    region: region,
    city: city,
    obj: obj,
    user: user
  });
});
// 데이터 update
router.put("/data/update/:id", async (req, res) => {
  fnMoveFileTempToDownload(req);
  let result = await dataModel.updateMany({ _id: req.params.id }, req.body);
  res.json(result);
});
// 데이터 검색
router.post("/data/search", async (req, res) => {
  let regex = { $regex: ".*" + req.body.searchText + ".*" };
  let list = await dataModel.aggregate([
    {
      $match: {
        $or: [{ data_no: regex }, { data_title: regex }]
      }
    }
  ]);
  res.json(list);
});
// 파일 upload
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./temps");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }
});
router.post("/data/file_upload", upload.array("file", 10), async (req, res) => {
  let files = await req.files;
  res.json(files);
});
//  파일 삭제
router.delete("/data/file/:id/:fileName", async (req, res) => {
  let id = req.params.id;
  let updateObj = {};
  updateObj[req.query.input_name] = "";
  let fileName = req.params.fileName;
  try {
    let path = "./downloads/" + fileName;
    if (fs.existsSync(path)) {
      fs.unlink(path, err => {
        if (err) throw err;
      });
    }
    let result = await dataModel.updateOne({ _id: id }, { $set: updateObj });
    res.json({ code: 0, message: "삭제 성공" });
  } catch (e) {
    console.error(e);
    res.json({ code: 9, message: "삭제 실패!" });
  }
});
// 엑셀 대량 업로드
router.post("/data/excelUpload", async (req, res) => {
  let result = await dataModel.insertMany(req.body);
  res.json(result);
});
// 환경설정 (Set-up)
router.get("/config", async (req, res) => {
  let data = await configModel.findOne({});
  let user = req.user;
  res.render("admin_config", {
    active: "config",
    data: data,
    user: user
  });
});
router.post("/config", async (req, res) => {
  let result = await configModel.findOneAndUpdate(
    {},
    { $set: req.body },
    { upsert: true }
  );
  res.json({ result: result, code: 1 });
});
module.exports = router;
