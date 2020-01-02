const express = require('express');
const router = express.Router();
const passport = require('passport');
const middle = require('./middlewares');
const sessionModel = require('../model/sessionModel');
const userModel = require('../model/userModel');
const userAgent = require('express-useragent');
const requestIp = require('request-ip');

router.get('/login', middle.isNotLoggedIn, (req, res) => {
  res.render('login');
});
router.post('/login', middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, obj, info) => {
    let user = obj.user;
    if (info) {
      return res.send('<script>alert("' + info.message + '"); location.href = "/auth/login";</script>');
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect('/auth/login');
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      if (user.status !== 1) {
        req.logout();
        // req.session.destroy();
        return res.send('<script>alert("로그인 권한이 없는 ID 입니다."); location.href = "/auth/login";</script>');
      }
      let agent = req.headers['user-agent'];
      let ua = userAgent.parse(agent);
      let browser = ua.browser;
      let ip_address = requestIp.getClientIp(req);
      console.log('browser : ', browser);
      console.log('ip address : ', ip_address);
      /*
      *   중복 로그인 체크 알고리즘
      *   1. 로그인 한 유저 정보 중 최근에 접속한 정보(login_info) 를 읽어온다.
      *   2. 중복 로그인 체크
      *     1) ip 와 browser 가 같으면 그대로 로그인하게 함.
      *     2) ip 는 같은데 browser 가 다르면 중복 로그인.
      *     3) ip 가 다르면 중복 로그인.
      */
      let isDuplicated = false;
      let user_id = req.session.passport.user;
      let doc = await userModel.findOne({user_id:user_id}, {login_info:1});
      let login_info = doc.login_info;
      if(login_info){
        if(login_info.ip !== ip_address && doc.lv === 1){
          console.log('ip 정보가 다름');
          isDuplicated = true;
        }else if(login_info.ip === ip_address && login_info.browser !== browser && doc.lv === 1){
          console.log('브라우저 정보가 다름');
          isDuplicated = true;
        }
      }
      // 중복 로그인인 경우, 중복로그인 확인 메세지 창 띄우기
      if(isDuplicated){
        res.redirect('/session/confirm');
        // 기존 로그인 정보를 최신 로그인 정보로 업데이트
        // await userModel.updateOne({user_id:user_id}, {$set:{login_info:{ip:ip_address, browser:browser}}});
      }else{
        res.redirect('/');
      }
      // let session_id = req.session.id;
      //
      // // session 에 로그인 된 id 가 있는지 먼저 확인
      // let sessions = await sessionModel.find({});
      // let connected_users = sessions.map((v) => {
      //   let obj = {};
      //   obj['session_id'] = v._id;
      //   let passport = JSON.parse(v.session).passport;
      //   obj['user_id'] = (passport ? passport.user : '');
      //   return obj;
      // });
      // let isAnotherSession = false;
      // if(user.lv !== 9){
      //   // 세션 아이디는 다르지만 사용자가 같을 때, 다른 기기에서 접속한 것으로 간주
      //   // 단, 관리자 아이디는 중복 로그인 허용
      //   connected_users.forEach((v) => {
      //     if (v.session_id !== session_id && v.user_id === user_id) isAnotherSession = true;
      //   });
      // }
      // if (isAnotherSession) res.redirect('/session/confirm');
      // else res.redirect('/');
    });
  })(req, res, next);
});
router.get('/logout', async (req, res, next) => {
  await sessionModel.deleteOne({_id:req.session.id});
  req.logout();
  // req.session.destroy();
  res.render('login');
});
module.exports = router;