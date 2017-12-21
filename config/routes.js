/**
 * Created by Hello on 2017/12/21.
 */
var _ = require('underscore');
var Movie = require('../models/movie');  //加载Movie数据模型
var User = require('../models/user');    //加载User数据模型

module.exports = function(app) {
    //pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        if(_user) {
            app.locals.user = _user;    //存储在本地数据中
        }
        next();
    });
// index page
    app.get('/',function(req, res){
        console.log('user in sesssion:');
        console.log(req.session.user);

        Movie.fetch(function(err,movies){
            if(err) {
                console.log(err);
            }
            res.render('index',{
                title: 'imooc 首页',
                movies: movies
            })
        });
    });

// signup 注册路由处理
    app.post('/user/signup',function(req, res){
        var _user = req.body.user;
        //首先看看当前数据库里面是否已经有了此用户
        User.find({name: _user.name}, function(err, user){
            if(err) {
                console.log(err);
            }
            if(user.length) { //注册用户已存在，在跳转到首页
                return res.redirect('/');
            } else { //新用户注册，则保存到数据库，跳转到用户列表页
                var newuser = new User(_user);
                newuser.save(function(err, user) {
                    if(err) {
                        console.log(err);
                    }
                    res.redirect('/admin/userlist');   //重定向到用户列表页
                });
            }
        });
    });
//signin 处理登录逻辑
    app.post('/user/signin',function(req, res){
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;

        //在数据库中查询是否这个名字的用户存在
        User.findOne({name: name},function(err, user){
            if(err) {
                console.log(err);
            }
            if(!user) {
                //如果用户不存在，则直接返回到首页
                res.redirect('/');
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
                }
            })
        });
    });
//logout 登出逻辑
    app.get('/logout', function(req, res){
        delete req.session.user; //删除会话记录
        delete app.locals.user;  //删除本地数据
        res.redirect('/');
    });
// userlist page
    app.get('/admin/userlist',function(req, res){
        User.fetch(function(err, users) {
            if(err) {
                console.log(err);
            }
            res.render('userlist',{
                title: 'imooc 用户列表页',
                users: users
            })
        })
    });
// detail page
    app.get('/movie/:id',function(req, res){
        var id = req.params.id; //获取movie的id
        Movie.findById(id, function (err, movie) {
            res.render('detail',{
                title: 'imooc ' + movie.title,
                movie: movie
            })
        });
    });

// admin page
    app.get('/admin/movie',function(req, res){
        res.render('admin',{
            title: 'imooc 后台录入页',
            movie: {
                title: '',
                doctor: '',
                country: '',
                year: '',
                poster: '',
                flash: '',
                summary: '',
                language: ''
            }
        });
    });
// admin update movie 更新电影
// 在列表页点击更新时，会重新回到后台录入页，需要将电影数据初始化到表单中
    app.get('/admin/update/:id',function(req, res) {
        var id = req.params.id;
        if(id) {
            Movie.findById(id, function (err, movie) {
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie
                })
            })
        }
    });
// admin post movie
// 处理后台录入页admin的表单提交的数据
    app.post('/admin/movie/new',function (req, res) {
        var id = req.body.movie._id;    //拿到这个电影的id，放在隐藏域中
        var movieObj = req.body.movie;
        var _movie;
        //判断数据是新加的还是更新已有数据
        if(id !== 'undefined') {//说明电影是已经存储过的
            Movie.findById(id, function (err, movie) {
                if(err) {
                    console.log(err);
                }
                //用post过来的数据movieObj更新已有的电影数据movie
                _movie = _.extend(movie, movieObj);
                _movie.save(function(err, movie){
                    if(err) {
                        console.log(err);
                    }
                    //更新成功后，重定向到详情页面
                    res.redirect('/movie/' + movie._id);
                })
            })
        } else {    //该电影是新加的,将传过来的字段构成一个新对象，存储进来
            _movie = new Movie({
                doctor: movieObj.doctor,
                title: movieObj.title,
                country: movieObj.country,
                language: movieObj.language,
                year: movieObj.year,
                poster: movieObj.poster,
                summary: movieObj.summary,
                flash: movieObj.flash
            });
            _movie.save(function(err, movie){
                if(err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        }
    });

// list page
    app.get('/admin/list',function(req, res){
        Movie.fetch(function(err, movies) {
            if(err) {
                console.log(err);
            }
            res.render('list',{
                title: 'imooc 列表页',
                movies: movies
            })
        })
    });

// list delete movie 列表页删除电影
    app.delete('/admin/list',function(req,res){
        var id = req.query.id;
        if(id) {
            Movie.remove({_id: id}, function(err, movie) {
                if(err) {
                    console.log(err);
                } else {
                    res.json({ success: 1});
                }
            });
        }
    });
};