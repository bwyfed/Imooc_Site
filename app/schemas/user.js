/**
 * Created by Hello on 2017/12/14.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    //0: normal user
    //1: verified user
    //2: professional user
    //>10 admin >50 super admin
    role: {
        type: Number,
        default: 0
    },
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
UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew) {
        //如果数据是新加的话，更新两个时间值
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(user.password,salt);
    user.password = hash;
    /*
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err, salt) {
        if(err) next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        })
    });
    */
    next();
});
//添加实例方法
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if(err) return cb(err);
            cb(null,isMatch);
        });
    }
};
//增加一些静态方法，经过Model实例化后才有这些方法
UserSchema.statics = {
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

module.exports = UserSchema;