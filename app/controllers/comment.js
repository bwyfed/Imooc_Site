/**
 * Created by BWY on 2017/12/27.
 */
var Comment = require('../models/comment');
//comment
exports.save = function(req, res) {
    var _comment = req.body.comment; //一个对象
    var movieId =_comment.movie;
    var comment = new Comment(_comment);

    comment.save(function(err, comment) {
        if(err) {
            console.log(err);
        }
        res.redirect('/movie/' + movie._id);
    })
};

