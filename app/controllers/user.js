/**
 * Created by Hello on 2017/12/21.
 *  处理用户相关的控制器
 */
var User = require('../models/user');    //加载User数据模型

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    })
};

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    })
};

// signup 注册路由处理
exports.signup = function(req, res){
    var _user = req.body.user;
    //首先看看当前数据库里面是否已经有了此用户
    User.find({name: _user.name}, function(err, user){
        if(err) {
            console.log(err);
        }
        if(user.length) { //注册用户已存在，在跳转到登录页面
            return res.redirect('/signin');
        } else { //新用户注册，则保存到数据库，跳转到用户列表页
            var newuser = new User(_user);
            newuser.save(function(err, user) {
                if(err) {
                    console.log(err);
                }
                res.redirect('/');   //重定向到首页
            });
        }
    });
};
//signin 处理登录逻辑
exports.signin = function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    //在数据库中查询是否这个名字的用户存在
    User.findOne({name: name},function(err, user){
        if(err) {
            console.log(err);
        }
        if(!user) {
            //如果用户不存在，则重定向到注册页面
            return res.redirect('/signup');
        }
        //对比密码是否匹配，调用模型实例上的一个方法
        user.comparePassword(password,function(err,isMatch){
            if (err) {
                console.log(err);
            }
            if(isMatch) {
                console.log('Password is matched');
                req.session.user = user;    //将user存储在会话中
                return res.redirect('/');
            } else {
                console.log('Password is not matched');
                res.redirect('/signin');    //密码不对，继续重定向到登录页面
            }
        })
    });
};
//logout 登出逻辑
exports.logout = function(req, res){
    delete req.session.user; //删除会话记录
    // delete app.locals.user;  //删除本地数据
    res.redirect('/');
};
// userlist page
exports.list = function(req, res){
    User.fetch(function(err, users) {
        if(err) {
            console.log(err);
        }
        res.render('userlist',{
            title: 'imooc 用户列表页',
            users: users
        })
    })
};

//middleware for user 登录的中间件
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    app.locals.user = user;
    if (!user) {
        return res.redirect('/signin');
    }
    next();
};

//middleware for user 权限的中间件
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) {
        return res.redirect('/signin');
    }
    next();
};