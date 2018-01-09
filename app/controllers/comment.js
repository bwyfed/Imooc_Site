/**
 * Created by BWY on 2017/12/27.
 */
var Comment = require('../models/comment');
//comment
exports.save = function(req, res) {
    var _comment = req.body.comment; //一个对象
    var movieId = _comment.movie;
    var comment = new Comment(_comment);
    comment.save(function (err, comment) {
        if (err) {
            console.log(err);
        }

        res.redirect('/movie/' + movieId);  //评论保存后，还能回到之前的movie页面中去
    });
    /*
    if(_comment.cid) {
        Comment.findById(_comment.cid, function(err,comment){
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };
            comment.reply.push(reply);
            comment.save(function(err,comment){

            })
        })
    } else {
        comment.save(function(err, comment) {
            if(err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }
    */
};

