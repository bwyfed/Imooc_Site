/**
 * Created by BWY on 2017/12/27.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;