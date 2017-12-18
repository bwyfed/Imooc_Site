/**
 * Created by BWY on 2017/12/12.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');   //session中间件
var port = process.env.PORT || 3000; //获取命令行里的全局环境变量
var app = express();    //创建web服务器

var Movie = require('./models/movie');  //加载Movie数据模型
var User = require('./models/user');    //加载User数据模型
var Treedata = require('./models/treedata');    //加载Treedata数据类型
mongoose.connect('mongodb://localhost/imooc');//连接指定的数据库实例

app.set('views','./views/pages');//设置视图的根目录
app.set('view engine','jade');//设置默认的模板引擎
app.use(bodyParser.json());  //对表单提交的数据进行格式化 bodyParser.json()?
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'imooc'
}));
app.use(express.static(path.join(__dirname,'public')));//托管静态资源
app.locals.moment = require('moment'); //添加moment模块
app.listen(port);

console.log('imooc start on port ' + port);

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
    /*res.render('index',{
        title: 'imooc 首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 5,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 6,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    });*/
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
    /*
     res.render('list',{
     title: 'imooc 列表页',
     movies: [
     {
     title: '机械战警',
     _id: 1,
     doctor: '何塞·帕迪里亚',
     country: '美国',
     year: 2014,
     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
     language: '英语',
     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
     summary: '翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪里亚执导的新版《机械战警》发布首款预告片。大热美剧《谋杀》男星乔尔·金纳曼化身新“机械战警”酷黑战甲亮相，加里·奥德曼、塞缪尔·杰克逊、迈克尔·基顿三大戏骨绿叶护航。预告片末更亮出了本片将登陆IMAX巨幕。新版《机械战警》故事背景跟原版一样，依旧设定在工业城市底特律，但故事年代已由之前设定的2020年变为了2028年，并且故事格局也明显扩大。在片中，金纳曼饰演的好警察墨菲将会被歹徒“杀死”，然后被进行军火开发的机器人公司Omni Corp改造成半人半机器的“机械战警”。'
     }
     ]
     });
     */
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
    /*res.render('detail',{
        title: 'imooc 详情页',
        movie: {
            doctor: '何塞·帕迪里亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪里亚执导的新版《机械战警》发布首款预告片。大热美剧《谋杀》男星乔尔·金纳曼化身新“机械战警”酷黑战甲亮相，加里·奥德曼、塞缪尔·杰克逊、迈克尔·基顿三大戏骨绿叶护航。预告片末更亮出了本片将登陆IMAX巨幕。新版《机械战警》故事背景跟原版一样，依旧设定在工业城市底特律，但故事年代已由之前设定的2020年变为了2028年，并且故事格局也明显扩大。在片中，金纳曼饰演的好警察墨菲将会被歹徒“杀死”，然后被进行军火开发的机器人公司Omni Corp改造成半人半机器的“机械战警”。'
        }
    });*/
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
    /*
    res.render('list',{
        title: 'imooc 列表页',
        movies: [
            {
                title: '机械战警',
                _id: 1,
                doctor: '何塞·帕迪里亚',
                country: '美国',
                year: 2014,
                poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                language: '英语',
                flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                summary: '翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪里亚执导的新版《机械战警》发布首款预告片。大热美剧《谋杀》男星乔尔·金纳曼化身新“机械战警”酷黑战甲亮相，加里·奥德曼、塞缪尔·杰克逊、迈克尔·基顿三大戏骨绿叶护航。预告片末更亮出了本片将登陆IMAX巨幕。新版《机械战警》故事背景跟原版一样，依旧设定在工业城市底特律，但故事年代已由之前设定的2020年变为了2028年，并且故事格局也明显扩大。在片中，金纳曼饰演的好警察墨菲将会被歹徒“杀死”，然后被进行军火开发的机器人公司Omni Corp改造成半人半机器的“机械战警”。'
            }
        ]
    });
    */
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

// get treedata 获取树形数据
app.get('/admin/treedata', function(req, res) {
    var arr = [],newarr=[],current,currentDoc;
    Treedata.findOne({_id: "Programming"},function(err, currentNode){
        currentDoc = currentNode._doc;
        console.log(currentDoc);
        arr.push(currentNode._doc);//arr表示当前队列
        while(arr.length>0) {
            current = arr.shift();
            newarr.push(current);
            while(currentDoc.children&&currentDoc.children.length>0) {
                current = currentDoc.children.shift();
                currentDoc = Treedata.findOne({_id: current});
                arr.push(currentDoc);
            }
        }
        console.log('平行遍历结果:');
        console.log(newarr);
    });
    /*
    Treedata.fetch(function(err,tree){
        if(err) {
            console.log(err);
        }
        console.log('get tree data:');
        console.log(tree);
        var root = 'Books'; //树形根节点
        res.json({
            success: 'ok'
        });
    });
    */
});

