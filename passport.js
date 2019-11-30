const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const User = require('./model/userModel');

passport.use(new LocalStrategy({
  usernameField:'user_id',
  passwordField:'user_pw'
}, async (user_id, password, done) => {
  try{
    const exUser = await User.findOne({user_id:user_id});
    if(exUser){
      if(exUser.user_pw === password){
        done(null, exUser);
      }else{
        done(null, false, {result:0, message:'비밀번호가 일치하지 않습니다'});
      }
    }else{
      done(null, false, {result:2, message:'가입되지 않은 회원입니다'});
    }
  }catch(error){
    console.error(error);
    done(error);
  }
}));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET
  },
  async (jwtPayload, done) => {
    console.log('payload : ', jwtPayload);
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    // return await User.findOne({user_id:jwtPayload.id});
    User.findOne({user_id: jwtPayload.sub}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  }
));
