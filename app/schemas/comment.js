/**
 * Created by BWY on 2017/12/27.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    movie: {type: ObjectId, ref: 'Movie'},
    from: {type: ObjectId, ref: 'User'},
    reply: [{
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String
    }],
    // to: {type: ObjectId, ref: 'User'},
    // content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
//给模式添加方法
//每次存储数据之前，都会调用一下这个方法
CommentSchema.pre('save',function(next){
    if(this.isNew) {
        //如果数据是新加的话，更新两个时间值
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
//增加一些静态方法，经过Model实例化后才有这些方法
CommentSchema.statics = {
    //取出目前数据库的所有数据
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updataAt')
            .exec(cb);
    },
    //查询单条数据
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = CommentSchema;