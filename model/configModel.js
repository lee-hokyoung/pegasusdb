const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// config 스키마
const configSchema = new Schema({
  forgot_password: {type: String, default: ''},
  request_report: {type: String, default: ''},
  request_data: {type: String, default: ''}
});
module.exports = mongoose.model('Config', configSchema);