const express = require('express');
const router = express.Router();
const passport = require('passport');
const middle = require('./middlewares');
const sessionModel = require('../model/sessionModel');

router.get('/login', middle.isNotLoggedIn, (req, res) => {
  res.render('login');
});
router.post('/login', middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
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
        res.send('<script>alert("로그인 권한이 없는 ID 입니다."); location.href = "/auth/login";</script>');
      }
      let session_id = req.session.id;
      let user_id = req.session.passport.user;
      // session 에 로그인 된 id 가 있는지 먼저 확인
      let sessions = await sessionModel.find({});
      let connected_users = sessions.map((v) => {
        let obj = {};
        obj['session_id'] = v._id;
        let passport = JSON.parse(v.session).passport;
        obj['user_id'] = (passport ? passport.user : '');
        return obj;
      });
      let isAnotherSession = false;
      if(user.lv !== 9){
        // 세션 아이디는 다르지만 사용자가 같을 때, 다른 기기에서 접속한 것으로 간주
        // 단, 관리자 아이디는 중복 로그인 허용
        connected_users.forEach((v) => {
          if (v.session_id !== session_id && v.user_id === user_id) isAnotherSession = true;
        });
      }
      if (isAnotherSession) res.redirect('/session/confirm');
      else res.redirect('/');
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