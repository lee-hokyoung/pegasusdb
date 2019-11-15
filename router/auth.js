const express = require('express');
const router = express.Router();
const passport = require('passport');
const middle = require('./middlewares');

router.get('/login', (req, res)=>{
    res.render('login');
});
router.post('/login', middle.isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info)=>{
        if(info){
            console.log('info : ', info);
            return res.send('<script>alert("' + info.message + '"); location.href = "/auth/login";</script>');
        }
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            console.log('user 인증 실패!');
            return res.redirect('/auth/login');
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            console.log('user : ', user);
            console.log('로그인 성공');
            return res.redirect('/');
        });
    })(req, res, next);
});
router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.render('login');
});
module.exports = router;