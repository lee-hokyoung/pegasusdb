const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user_lv = req.session.passport.user.lv;
    next();
  } else {
    res.redirect('/auth/login');
  }
};
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.session.passport.user.lv > 1) {
      res.locals.user_lv = req.session.passport.user.lv;
      next();
    } else {
      let msg = '<script>alert("접근권한이 없습니다.");history.back();</script>';
      res.send(msg);
    }
  } else {
    res.redirect('/auth/login');
  }
};
exports.checkAuth = async (req, res, next) => {
  let token = req.cookies.access_token;

  console.log('cookie : ', req.cookies);
  if (!token) {
    console.log('토큰 없음');
    res.redirect('/auth/login');
  } else {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode : ', decoded);
    if (!decoded) {
      console.log('토큰 정보가 다름... 리다이렉트');
      res.redirect('/auth/login');
    } else {
      let user = await User.findOne({user_id: decoded.user_id});
      if (!user) {
        console.log('유저정보 없음');
        res.redirect('/auth/login');
      } else {
        res.locals.user_info = {user_id:user.user_id, category:user.category, user_lv:user.lv};
        next();
      }
    }
  }
};