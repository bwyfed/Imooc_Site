/**
 * Created by BWY on 2017/12/28.
 */
$(function(){
    $('.comment').click(function(e){
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');

        $('<input>').attr({
            type: 'hidden',
            name: 'comment[tid]',
            value: toId
        }).appendTo('#commentForm');

        $('<input>').attr({
            type: 'hidden',
            name: 'comment[cid]',
            value: commentId
        }).appendTo('#commentForm');
    })
})