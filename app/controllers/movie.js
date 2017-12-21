/**
 * Created by Hello on 2017/12/21.
 */
var _ = require('underscore');
var Movie = require('../models/movie');  //加载Movie数据模型

//detail page
exports.detail = function(req, res) {
    var id = req.params.id;
    if(id) {
        Movie.findById(id, function (err, movie) {
            res.render('detail', {
                title: 'imooc 详情页',
                movie: movie
            })
        })
    }
};
// admin page
exports.new = function(req, res){
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
};

// admin update movie 更新电影
// 在列表页点击更新时，会重新回到后台录入页，需要将电影数据初始化到表单中
exports.update = function(req, res) {
    var id = req.params.id;
    if(id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
};
// admin post movie
// 处理后台录入页admin的表单提交的数据
exports.save =function (req, res) {
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
};

// list page
exports.list = function(req, res){
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies: movies
        })
    })
};

// list delete movie 列表页删除电影
exports.del = function(req,res){
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
};
