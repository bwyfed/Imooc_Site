/**
 * Created by Hello on 2017/12/16.
 */
var mongoose = require('mongoose');
var TreedataSchema = new mongoose.Schema({
    _id: {
        unique: true,
        type: String
    },
    children: Array
});
//给模式添加方法
//每次存储数据之前，都会调用一下这个方法
TreedataSchema.pre('save',function(next){
    var tree = this;
    console.log('before save, _id:'+tree._id+',children:'+tree.children);
});
//添加实例方法
TreedataSchema.methods = {

};
//增加一些静态方法，经过Model实例化后才有这些方法
TreedataSchema.statics = {
    //取出目前数据库的所有数据
    fetch: function(cb) {
        return this
            .find({})
            .exec(cb);
    },
    //查询单条数据
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = TreedataSchema;