/**
 * Created by Hello on 2017/12/16.
 */
$(function(){
    //获取树形数据
    var $btn = $('button#getTreeBtn');
    $btn.on('click',function(){
        $.ajax('/admin/treedata',{
            type: 'GET'
        }).done(function(result){
            console.log('get tree data');
            console.log(result);
        });
    })
});