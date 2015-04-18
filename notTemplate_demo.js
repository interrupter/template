var dataSetSingle = {
    title: 'this is title',
    body: 'this is body',
    new: function(){
        return true
    }
};

var dataSetArray = [
    {title: 'title 1', body: 'body 1', authorName: 'me', new: true },
    {title: 'title 2', body: 'body 2', authorName: 'me', new: true },
    {title: 'title 3', body: 'body 3', authorName: 'me', old: function(){ return true;} },
    {title: 'title 4', body: 'body 4', authorName: 'me'},
    {title: 'title 5', body: 'body 5', authorName: 'me', tags: ['some', 'tags']}
 ];

var helpers = {
    capitalize: function(item, index){
        return item.toUpperCase(item.title);
    }
};

$(function(){
    var singleElementContent = (new notTemplate('singleTemplate', dataSetSingle)).exec();
    console.log(singleElementContent);
    $('#singleElement').append(singleElementContent);

    var manyElementsContent = (new notTemplate('manyTemplate', dataSetArray)).exec();
    $('#manyElements').append(manyElementsContent);
});
