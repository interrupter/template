# template
Simple JS template engine


#owerview
```
 data-not-[hereProccessorExpression]="[hereAttributeExpression]"
```
 result of attribute expression will be handed to proccessor with additional params if they defined in proccessor expression
 proccessor is just function inside notTemplate.prototype.proccessorsLib

#few standart variants

 add class to element if condition is true
```
 data-not-addClass-[nameOfClass]-if="[:nameOfItemFieldFlag|:nameOfItemFunction()|::nameOfHelpersFieldFlag|::nameOfHelpersFunction()]"
```
 insert in element data of item.title
```
 data-not-provider="[someAttributeExpression]"
```
 will insert into element CAPITALIZED title, 'capitalize' will be in input.params array
 for better understanding take a look in notTemplate.js
```
 data-not-provider-capitalize=":title"
```
 way to perfom your own more complex proccessing

```
 data-not-[mySuperFunction]-[param1]-[param2]...-[if]="[:nameOfField|:nameOfFunction()|::nameOfField|::nameOfFunction()]"
```

 mySuperFunction should be in notTemplate.prototype.proccessorsLib object, with name in lower case only


#syntax in attributes Expressions

 : - grants access to current item property or function
 :: - grants access to helpers property or function

 ! expression parsed, but not evaluted. You can access only to direct properties or functions.
 ! if you need sub-something, add function in helpers, that will do it.

```
 :[something] - try to insert item.something
 :[something]() - try to insert result of item.something()
 ::[something] - try to insert helpers.something
 ::[something]() - try to insert result of helpers.something(item)
```

#helpers

 helpers - object with data or functions
```javascript
 var helpers = {
    falseIfIndex: 10,
    getFalseOn: function(item, index){
        return this.falseIfIndex!==index;
    },
 };
```
#templates

 Should be defined inside html file or what ever place jquery selector engine can find it
 Or in plain html file.
```html
 <div data-notTemplate-name="[nameOfTemplate]">
     html of template here
 </div>
```
#Final complex examle

 Define template right in your html page
```html
 <dotTemplate data-notTemplate-name="manyTemplate">
        <div class="col-6 col-sm-6 col-lg-4">
            <h2 data-not-provider=":title"></h2>
            <p data-not-provider=":body"></p>
            <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </div>
    </dotTemplate>
```
 Define container element where result should be inserted

```html
 <div class="row" id="manyElements"></div>
```

Code to make it all work

```javascript
 var data = [
    {title: 'title 1', body: 'body 1', authorName: 'me', new: true },
    {title: 'title 2', body: 'body 2', authorName: 'me', new: true },
    {title: 'title 3', body: 'body 3', authorName: 'me', old: function(){ return true;} },
    {title: 'title 4', body: 'body 4', authorName: 'me'},
    {title: 'title 5', body: 'body 5', authorName: 'me', tags: ['some', 'tags']}
 ];

 var helpers = {
    getTags: function(item, index){ return item.tags.join(', ');}
 };

var manyElementsContent = (new notTemplate({templateName: 'manyTemplate', data: dataSetArray})).exec();
$('#manyElements').append(manyElementsContent);
```

If you want place template in html file, you can access to it like this

```
var urlToHTMLTemplate = 'path/filename.html';
var afterExecCallback = function(elements){
    $('#manyElements').append(elements);
}
var manyElementsContent = (new notTemplate({templateURL: urlToHTMLTemplate, data: dataSetArray})).exec(afterExecCallback);
```

You can use callbacks for inline html templates to, but if it not defined, resulting elements set wil be returned;

