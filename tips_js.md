# JAVASCRIPT

- the way you separate different process inside a file is by using iife

# JQUERY PROMISES

```javascript
var workingUrl = 'http://jsonplaceholder.typicode.com/posts/1';

ajax = $.get(workingUrl);
ajaxPromise = ajax.then(function(response){
  return 1;
},
function(){
  return 'ERROR 1';
});

ajax2 = $.get(workingUrl);
ajaxPromise2 = ajax2.then(function(response){
  return 2;
},
function(){
  return 'ERROR 2';
});

$.when(ajaxPromise, ajaxPromise2).then(function(aResult, bResult){
  console.log('success: ');
  console.log(aResult, bResult);
},
function(error){
  console.log('error: ');
  console.log(error);
});

// Always try to use the then(onSuccess, onError) method instead of the done(onSuccess), error(onError) methods. Since we can do chaining with then and returning the values that we want.
// You can abort any ajax request by calling the abort method. eg. ajax.abort(); NOTE: If you abort, the error function will be called
```

