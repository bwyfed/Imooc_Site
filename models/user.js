/**
 * Created by BWY on 2017/12/15.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User =mongoose.model('User', UserSchema); //编译生成User(第1个参数)这个模型

module.exports = User;