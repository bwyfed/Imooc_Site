/**
 * Created by BWY on 2017/12/13.
 */
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie =mongoose.model('Movie', MovieSchema); //编译生成Movie(第1个参数)这个模型

module.exports = Movie;