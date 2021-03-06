const express = require("express");
const router = express.Router();
const dataModel = require("../model/dataModel");
const categoryModel = require("../model/categoryModel");
const regionModel = require("../model/regionModel");
const cityModel = require("../model/cityModel");
const userModel = require("../model/userModel");
const middle = require("./middlewares");
const passport = require("passport");

let obj = [{ name: "Industry" }, { name: "Market" }, { name: "Consumer" }, { name: "Company" }];

// main 화면
router.get("", middle.isLoggedIn, async (req, res) => {
  let user = req.user;
  let category = await categoryModel.aggregate([
    {
      $group: {
        _id: { id: "$group_id", name: "$group_name" },
        group_order: { $first: "$group_order" },
        list: { $push: "$$ROOT" },
      },
    },
    { $sort: { group_order: 1 } },
  ]);
  res.render("home", {
    category: category,
    user_category: user.category,
    user: user,
  });
});
// list 화면
router.get("/list/:cate/:cate_item?", middle.isLoggedIn, async (req, res) => {
  let strQuery = req.query;
  let cate = req.params.cate;
  let cate_item = req.params.cate_item;
  let cate_list = await categoryModel.find({
    group_id: cate,
  });
  let region_list = await regionModel.find({});
  let city_list = await cityModel.find({});
  let list = await fnGetList(strQuery, req.params);
  let user = req.user;
  if (user.category.indexOf(cate_item) === -1) {
    let msg = '<script>alert("접근권한이 없습니다.");history.back();</script>';
    res.send(msg);
    return false;
  }
  res.render("list", {
    cate: cate,
    cate_item: cate_item,
    list: list,
    cate_list: cate_list,
    region_list: region_list,
    city_list: city_list,
    object: obj,
    strQuery: strQuery,
    user_category: user.category,
    user: user,
  });
});
// get by ajax -> 이제 이건 안 써
router.get("/ajax/list/:cate/:cate_item?/:searchText?", middle.isLoggedIn, async (req, res) => {
  let strQuery = req.query;
  let list = await fnGetList(strQuery, req.params);
  res.json({
    list: list,
    cate: req.params.cate,
    cate_item: req.params.cate_item,
  });
});

const fnGetList = async (strQuery, params) => {
  let query_match = [{}];
  let cate = params.cate;
  let cate_item = params.cate_item;
  // let searchText = params.searchText || "";
  let searchText = strQuery.searchText || "";
  let searchRegex = { $regex: ".*" + searchText + ".*", $options: "i" };
  let cate_info = await categoryModel.findOne({ cate_id: cate_item });
  let cate_obj = {};
  cate_obj["category_obj." + cate + "." + cate_item] = cate_info.cate_name;
  let unwind_query = { $unwind: "$category_obj." + cate };
  let cate_query = { $match: cate_obj };
  if (Object.keys(strQuery).length > 0) {
    query_match = Object.keys(strQuery)
      .filter(function (key) {
        if (key !== "list_size" && key !== "page" && key !== "searchText") return key;
      })
      .map(function (key) {
        if (key === "region") {
          return {
            $or: [
              {
                $expr: {
                  $gt: [{ $indexOfArray: ["$region_array", strQuery[key]] }, -1],
                },
              },
              {
                $expr: {
                  $gt: [{ $indexOfArray: ["$city_array", strQuery[key]] }, -1],
                },
              },
            ],
          };
        } else if (key === "object") {
          return {
            $expr: { $gt: [{ $indexOfArray: ["$object", strQuery[key]] }, -1] },
          };
        }
      });
  }
  if (query_match.length === 0) query_match = [{}];
  const page = strQuery.page || 1;
  let size = parseInt(strQuery.list_size) || 10;
  const limit = size;
  const skip = size * (page - 1);
  // let limit = { $limit: 20 };
  if (strQuery.list_size) {
    limit["$limit"] = parseInt(strQuery.list_size);
  }
  return await dataModel.aggregate([
    {
      $match: {
        $or: [{ data_title: searchRegex }, { region_array: searchRegex }, { city_array: searchRegex }],
      },
    },
    unwind_query,
    cate_query,
    {
      $match: {
        $and: query_match,
      },
    },
    { $sort: { updated: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: page, limit: limit } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);
};

// list 조회
router.post("/list", middle.isLoggedIn, async (req, res) => {});
module.exports = router;
