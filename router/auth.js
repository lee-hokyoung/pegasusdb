const express = require('express');
const router = express.Router();
const passport = require('passport');
const middle = require('./middlewares');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

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
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log('user : ', user);
      if(user.status !== 1){
        req.logout();
        req.session.destroy();
        res.send('<script>alert("로그인 권한이 없는 ID 입니다."); location.href = "/auth/login";</script>');
      }
      return res.redirect('/');
    });
  })(req, res, next);
});
// router.post('/login', passport.authenticate('local'), async(req, res) => {
//     res.end();
// });
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local',  (authError, user, info)=>{
//         console.log('info : ', info);
//         console.log('user : ', user);
//         // if(info){
//         //     return res.send('<script>alert("' + info.message + '"); location.href = "/auth/login";</script>');
//         // }
//         if(authError){
//             console.error(authError);
//             return next(authError);
//         }
//         if(!user){
//             console.log('not user');
//             return res.redirect('/auth/login');
//         }
//         return req.login(user, {session:false}, async (loginError) => {
//             if(loginError){
//                 console.error(loginError);
//                 return next(loginError);
//             }
//             let payload = {
//                 user_state:user.user_state,
//                 user_id:user.user_id,
//                 user_lv:user.lv,
//             };
//             const token = jwt.sign(payload, process.env.JWT_SECRET,
//               {expiresIn:'60m', issuer:'pegasusdb.link', subject:'userInfo'});
//             await userModel.updateOne({user_id:user.user_id}, {tokens:token});
//             // console.log('token : ', token);
//             res.cookie('access_token', token, {
//                 maxAge:1000*60*60,
//                 httpOnly:true
//             });
//             res.redirect('/');
//             // req.headers.authorization = token;
//             // res.set('Authorization', token);
//             // res.cookie('x-auth-token', token);
//             // console.log('result : ', result);
//             // res.cookie('x-auth-token', token).json({token});
//             // res.header("x-auth-token", token).send({
//             //     user_id: user.user_id,
//             //     user_lv: user.lv,
//             //     user_state: user.user_state
//             // });
//             // return res.cookie('x-auth-token', token);
//         });
//     })(req, res, next);
// });
router.get('/logout', function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.render('login');
});
module.exports = router;