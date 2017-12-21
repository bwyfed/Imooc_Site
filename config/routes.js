/**
 * Created by Hello on 2017/12/21.
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

module.exports = function(app) {
    //pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;    //存储在本地数据中
        next();
    });

    //Index
    app.get('/',Index.index);
    // User
    app.post('/user/signup', User.signup);
    app.post('/user/signin',User.signin);
    app.get('/logout',User.logout);
    app.get('/admin/userlist',User.list);
    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie',Movie.new);  // /admin/new?
    app.get('/admin/update/:id',Movie.update);
    app.post('/admin/movie/new', Movie.save);  // /admin/movie?
    app.get('/admin/list',Movie.list);
    app.delete('/admin/list',Movie.del);
};