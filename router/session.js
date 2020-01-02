const express = require('express');
const router = express.Router();
const sessionModel = require('../model/sessionModel');
const userModel = require('../model/userModel');
const userAgent = require('express-useragent');
const requestIp = require('request-ip');

router.get('/confirm', async (req, res) => {
  res.render('session_confirm');
});
// 해당 기기로 로그인
router.get('/this', async (req, res) => {
  let user_id = req.session.passport.user;
  let regex = {$regex: '.*' + user_id + '.*'};
  let current_session = req.session.id;

  //  기존 로그인 정보의 세션 삭제
  let loggedInSession = await sessionModel.deleteMany(
    {
      session: regex,
      _id: {$ne: current_session}
    }
  );
  //  새로운 로그인 정보 업데이트
  let agent = req.headers['user-agent'];
  let ua = userAgent.parse(agent);
  let browser = ua.browser;
  let ip_address = requestIp.getClientIp(req);
  await userModel.updateOne({user_id:user_id}, {$set:{login_info:{ip:ip_address, browser:browser}, sessionID:current_session}});

  res.redirect('/');
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
