/**
 * Created by BWY on 2017/12/13.
 */
var mongoose = require('mongoose');
var TreedataSchema = require('../schemas/treedata');
var Treedata =mongoose.model('Treedata', TreedataSchema, 'book'); //编译生成Movie(第1个参数)这个模型

module.exports = Treedata;