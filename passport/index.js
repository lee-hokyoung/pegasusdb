const local = require('./localStrategy');
const userModel = require('../model/userModel');
/*
*   전체 과정
*   1. 로그인 요청이 들어옴
*   2. passport.authenticate 메서드 호출
*   3. 로그인 전략 수행
*   4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
*   5. req.login 메서드가 passport.serializeUser 호출
*   6. req.session 에 사용자 아이디만 저장
*   7. 로그인 완료
* */
module.exports = (passport) => {
  // 세션에 아이디를 저장
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  // 세션에 저장한 아이디를 통해 사용자 정보 객체 불러오기
  passport.deserializeUser(async (user, done) => {
    // userModel.findOne({user_id:user_id})
    //   .then((user) => {console.log('user : ', user); done(null, user);})
    //   .catch(err => done(err));
    let _user = await userModel.findOne({user_id: user}, {user_id: 1, manager_name: 1, status: 1, lv: 1, category:1});
    // console.log('deserializeUser user : ', user);
    try {
      done(null, _user);
    } catch (e) {
      done(e);
    }
  });
  local(passport);
};