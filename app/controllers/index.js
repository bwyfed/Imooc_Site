/**
 * Created by Hello on 2017/12/21.
 * 负责和首页进行交互
 */
var Movie = require('../models/movie');  //加载Movie数据模型
// index page
exports.index = function(req, res){
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
};
