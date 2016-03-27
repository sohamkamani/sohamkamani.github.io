---
layout: post
title:  "How to work with NodeJS and not lose your mind  😫"
date:   2015-08-21 18:45:12
categories: jekyll update
comments: true
---
<p>NodeJS is great! Its fast, its event based, and it uses the same language front-end developers know and love in he server as well. One of the greatest features of nodeJs is its non-blocking nature, which means that operations which seemed expensive before, like reading user input, and database operations, are now not a problem. Unfortunately this is also one of one of the most dangerous aspects of nodeJs as it makes it really easy for developers to write horrible code.
The non-blocking IO means that you now rely on callbacks to perform tasks after an operation has occured, which can lead to quite a messy situation. </p>
<!-- more -->
<p>Lets take a look at a simple example to get to know what exactly I mean.</p>
<p>FYI, In all the snippets below, I use the callback structure of expressJs, since it is the most popular backend framework for nodeJs. As for the database operations, I use the Waterline ORM, which uses the general format of :</p>
{% highlight javascript %}
SomeDataBase.find({/*Javascript object to find*/},/*callback after element is found in the database*/);

SomeDataBase.create({/*Javascript object to insert/create*/},/*callback after element is inserted in the database*/);

SomeDataBase.update({/*Javascript object to update*/},{/*what to update it with*/},/*callback after element is inserted in the database*/);
{% endhighlight %}
<p>Now, back to the example... I want to define a route, which receives a name as one of the request parameters. I want to then search a particular database for that name, update it if it exists, or create a new entry if it doesnt exist.
 </p>



<p>Lets look at the naive approach first : </p>

{% highlight javascript %}
var someRoute = function(req, res){
  var name = req.params.name;
  MyDb1.find({name: name}, function(err, data){
      if(data.length > 0){
        MyDb.update({name: name},{updated: 'yes'}, function(err, data){
          console.log('updated');
          res.end('User with name:', name, 'updated from MyDb1');
        });
      } else{
        MyDb.create({name: name}, function(err, data){
          console.log('created');
          res.end('User with name:', name, 'created from MyDb1');
        });
      }
  });
}
{% endhighlight %}

<p>Yikes! Not only does this code look horrible to the eye, but its also untestable, and repeats a lot of similar functionality. One thing we could try is to take the callback function out of the create and update operations. It would then look something like this:</p>
{% highlight javascript %}

var someRoute = function(req, res){
  var name = req.params.name;
  var dbCallback = function(err, data){
          console.log('done');
          res.end('User with name:', name, 'done from MyDb1');
        };
  MyDb1.find({name: name}, function(err, data){
      if(data.length > 0){
        MyDb.update({name: name},{updated: 'yes'}, dbCallback);
      } else{
        MyDb.create({name: name}, dbCallback);
      }
  });
}
{% endhighlight %}

<p>Ok, this sort of looks ok, but there are a couple of problems with this approach. First, we dont know whether the entry has been created or updated, and as an admin, its important to me to know the nature of operations taking place on the database. Secondly, we cant use the same callback function for any other database, as the response says 'MyDb1'. What we essentially want in this case is a function which does mostly the same things with only very few different things. Luckily, the first class functions of javascript have got your back! </p>

{% highlight javascript %}

var giveResponse = function(dbName, type, res){
  return function(err, data){
    console.log(type);
    res.end('User with name:', data.name, type + ' from ' + dbName);
  };
};

var someRoute = function(req, res){
  var name = req.params.name;
  MyDb1.find({name: name}, function(err, data){
      if(data.length > 0){
        MyDb1.update({name: name},{updated: 'yes'}, giveResponse('MyDb1', 'updated', res));
      } else{
        MyDb1.create({name: name}, giveResponse('MyDb1', 'created', res));
      }
  });
  {% endhighlight %}

<p>So this looks quite a bit better than before. We now have a function 'giveResponse' which generates the callback function we want based on the arguments we give it. Take note, 'giveResponse' is <em>not</em> our actual callback function, it simply <em>returns</em> the callback function which does something slightly differently based on the parameters passed to 'giveResponse'. In this case, were passing the name of our database, the type of operation, and our response object, which means we can modify any one of these based on our requirements. One more advantage of this approach is that the callback function is now easily testable, because we can now replace the dbName, type,and res parameters with our own mocks, and test the giveResponse function as a separate unit, something we couldnt do before.
Even though this is a major improvement from the previous code snippet, there is still a lot more we can do to improve it looking at future use cases. Take, for example, the process of updating an entry if it exists and creating it if it doesnt. This seems like a fairly common problem, and thus it would be wise to take that functionality and put it into its own unit. This insert/update process actually has its own name, called (unsurprisingly) 'upsert'. Lets move upsert into its own block of code.</p>

{% highlight javascript %}

var giveResponse = function(dbName, type, res){
  return function(err, data){
    console.log(type);
    res.end('User with name:', data.name, type + ' from ' + dbName);
  };
};

var upsert = function(name, db, dbName, res){
  return function(err, data){
      if(data.length > 0){
        db.update({name: name},{updated: 'yes'}, giveResponse(dbName, 'updated', res));
      } else{
        db.create({name: name}, giveResponse(dbName, 'created', res));
      }
  };
};

var someRoute = function(req, res){
  var name = req.params.name;
  MyDb1.find({name: name}, upsert(name, MyDb1, 'MyDb1', res));
}

{% endhighlight %}

<p>Similar to 'giveResponse', 'upsert' is not our callback, but returns another function which is. The reason we cant just use 'giveResponse' and 'upsert' as callbacks directly is because the callbacks for most database operations use the standard <code>function(err, result)</code> format, thus we cannot directly pass on more arguments as we like, but we <em>can</em> pass them on through their 'overlooking' functions. This whole process of returning a different function through another function is known as function currying, and its especially useful for situations like these.</p>

<p>If we wanted to make another route which did a similar upsert on another parameter, all we would have to add would be : </p>

{% highlight javascript %}

var someOtherRoute = function(req, res){
  var name = req.params.name;
  MyDb2.find({name: name}, upsert(name, MyDb2, 'MyDb2', res));
}
{% endhighlight %}

<p> Hopefully now dealing with the increasing number of callbacks and async operations won't be as much of a pain as it was originally. Of course, there is no such thing as the 'best' solution to deal with this kind of callback hell, and there are many, many more solutions (like the async library, promises and ES6 generators) to make your life easier. The one thing in my opinion to keep in mind, regardless of the method you use, is to follow the DRY (dont repeat yourself) principle, so that the same functionality, or functionality that is likely to be used again, is not isolated from the rest of the code, and can be called easily as and when required.</p>
