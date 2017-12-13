/**
 * Created by BWY on 2017/12/12.
 */
var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000; //获取命令行里的全局环境变量
var app = express();    //创建web服务器

app.set('views','./views');//设置视图的根目录
app.set('view engine','jade');//设置默认的模板引擎
app.listen(port);

console.log('imooc start on port ' + port);

// index page
app.get('/',function(req, res){
    res.render('index',{
        title: 'imooc 首页'
    });
});

// detail page
app.get('/movie/:id',function(req, res){
    res.render('detail',{
        title: 'imooc 详情页'
    });
});

// admin page
app.get('/admin/movie',function(req, res){
    res.render('admin',{
        title: 'imooc 后台录入页'
    });
});

// list page
app.get('/admin/list',function(req, res){
    res.render('list',{
        title: 'imooc 列表页'
    });
});