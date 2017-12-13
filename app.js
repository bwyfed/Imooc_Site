/**
 * Created by BWY on 2017/12/12.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000; //获取命令行里的全局环境变量
var app = express();    //创建web服务器

var Movie = require('./models/movie');
mongoose.connect('mongodb://localhost/imooc');

app.set('views','./views/pages');//设置视图的根目录
app.set('view engine','jade');//设置默认的模板引擎
app.use(bodyParser());  //对表单提交的数据进行格式化 bodyParser.json()?
app.use(express.static(path.join(__dirname,'bower_components')));//托管静态资源
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc start on port ' + port);

// index page
app.get('/',function(req, res){
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

// detail page
app.get('/movie/:id',function(req, res){
    var id = req.params.id;
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
// admin update movie 更新数据
app.get('admin/update/:id',function(req, res) {
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
// admin post movie 处理提交的数据
app.post('admin/movie/new',function (res, req) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(id !== undefined) {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie){
                if(err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
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