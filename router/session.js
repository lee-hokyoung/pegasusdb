const express = require('express');
const router = express.Router();
const sessionModel = require('../model/sessionModel');
const userModel = require('../model/userModel');
const userAgent = require('express-useragent');
const requestIp = require('request-ip');

router.get('/confirm', async(req, res) => {
  res.render('session_confirm');
});
// 해당 기기로 로그인
router.get('/this', async(req, res) => {
  //  기존 로그인 정보의 세션 삭제
  let user_id = req.session.passport.user;
  let last_user = await userModel.findOne({user_id:user_id});
  await sessionModel.deleteOne({_id:last_user.sessionID});
  //  새로운 로그인 정보 업데이트
  let agent = req.headers['user-agent'];
  let ua = userAgent.parse(agent);
  let browser = ua.browser;
  let ip_address = requestIp.getClientIp(req);
  let result = await userModel.updateOne({user_id:user_id}, {$set:{login_info:{ip:ip_address, browser:browser}, sessionID:req.session.id}});
  console.log('result : ', result);
  res.redirect('/');
  // let session_id = req.session.id;
  // let user_id = req.session.passport.user;
  // let sessions = await sessionModel.find({});
  // let connected_user = sessions.map((v) => {
  //   let obj = {};
  //   obj['session_id'] = v._id;
  //   let passport = JSON.parse(v.session).passport;
  //   obj['user_id'] = (passport?passport.user:'');
  //   return obj;
  // });
  // connected_user.forEach(async (v) => {
  //   // 세션 아이디는 다르지만 사용자 아이디가 같을 때, 다른 기기에서 접속한 것으로 간주
  //   if(v.session_id !== session_id && v.user_id === user_id){
  //     let result = await sessionModel.deleteOne({_id:v.session_id});
  //   }
  // });
});
// 기존 로그인 유지
router.get('/original', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
router.get('/list', async (req, res) => {
  let ses_list = req.session;

  console.log('session list : ', ses_list);
  res.end();
});
module.exports = router;
