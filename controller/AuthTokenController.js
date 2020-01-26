const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

exports.create = (req, res) => {
  passport.authenticate('local', {session:false}, (err, user) => {
    if(err || !user){
      return res.status(400).json({
        message:'something is wrong',
        user:user
      });
    }
    req.login(user, {session:false}, (err) => {
      if(err){
        res.send(err);
      }
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      return res.json({user, token})
    });
  })(req, res);
};