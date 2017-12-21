/**
 * Created by BWY on 2017/12/12.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');   //session中间件
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000; //获取命令行里的全局环境变量
var app = express();    //创建web服务器
var dbUrl = 'mongodb://localhost/imooc';

var Treedata = require('./models/treedata');    //加载Treedata数据类型
mongoose.connect(dbUrl);//连接指定的数据库实例

app.set('views','./views/pages');//设置视图的根目录
app.set('view engine','jade');//设置默认的模板引擎
app.use(bodyParser.json());  //对表单提交的数据进行格式化 bodyParser.json()?
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(express.static(path.join(__dirname,'public')));//托管静态资源
app.locals.moment = require('moment'); //添加moment模块
require('./config/routes')(app);
app.listen(port);

console.log('imooc start on port ' + port);

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
});

