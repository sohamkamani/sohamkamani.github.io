---
layout: post
title: How express.js works - Understanding the internals of the express library ⚙️
date: 2018-05-30T08:45:12.000Z
categories: javascript node js express
main_image: "https://www.sohamkamani.com/assets/images/posts/express-internals/express-routing-logo.png"
comments: true
---

If you've worked on web application development in node, it's likely you've heard of [express.js](https://expressjs.com/). Express is one of the most popular lightweight web application frameworks for node.

![logo](/assets/images/posts/express-internals/express-routing-logo.png)

In this post, we will go through the source code of express, and try to understand how it works under the hood. Studying how a popular open source library works, will help us make better applications using it, and reduces some of the "magic" involved when using it.

<!-- more -->

- [The "Hello World" example](#the-hello-world-example)
- [Creating a new express application](#creating-a-new-express-application)
- [Creating a new route](#creating-a-new-route)
  * [Layers](#layers)
- [Starting the HTTP server](#starting-the-http-server)
- [Handling an HTTP request](#handling-an-http-request)
- [Everything else](#everything-else)

>You may find it helpful to keep a copy of the express source code handy while we go through the post. We are using [this version](https://github.com/expressjs/express/tree/c0136d8b48dd3526c58b2ad8666fb4b12b55116c). Even if you don't, links to the original source code are provided before each explanation.  
This comment: `// ... ` means that the original code has been hidden for brevity

## The "Hello World" example

Let's use the "Hello world" example given in the official website to form a starting point for digging into the source code:

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

This code starts a new HTTP server on port 3000, and sends a "hello world"  text response when we hit the `GET /` route. Broadly speaking, there are four stages that we can analyze:

1. Creating a new express application
2. Creating a new route
3. Starting an HTTP server on a given port number
4. Handling a request once it comes in

## Creating a new express application

The `var app = express()` statement creates a new express application for you. The `createApplication` function from the [lib/express.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/express.js#L37) file is the default export, which we see as the `express()` function call.

Some of the important bits are:

```js
// ...
var mixin = require('merge-descriptors');
var proto = require('./application');

// ...

function createApplication() {
  // This is the returned application variable, which we will get to later in the post. 
  //The important thing to remember is it's signtature of `function(req, res, next)`
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  // ...

  // The `mixin` function assigns all the methods of `proto` as methods of `app`
  // One of the methods which it assigns is the `get` method which is used in the example
  mixin(app, proto, false);

 // ...

  return app;
}
```

The `app` object returned from this function is one that we use in our application code. The `app.get` method is added by using the [merge-descriptors](https://github.com/component/merge-descriptors) libraries `mixin` function, which assigns the methods defined in `proto`.

`proto` itself is imported from [lib/application.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/application.js). 

## Creating a new route

Let's now take a brief look at the [code](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/application.js#L472) that creates the `app.get` method that we use in the example:

```js
var slice = Array.prototype.slice;

// ...
/**
 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
 */

// `methods` is an array of HTTP methods, (something like ['get','post',...])
methods.forEach(function(method){
  // This would be the app.get method signature
  app[method] = function(path){
    // some initialization code

    // create a route for the path inside the applications router
    var route = this._router.route(path);

    // call the handler with the second argument provided
    route[method].apply(route, slice.call(arguments, 1));

    // returns the `app` instance, so that methods can be chained
    return this;
  };
});
```

It's interesting to note that besides the semantics, all the HTTP verb methods, like `app.get`, `app.post`, `app.put`, and the like, are essentially the same in terms of functionality. If we were to simplify the above code only for the `get` method, it would look like this:

```js
app.get = function(path, handler){
  // ...
  var route = this._router.route(path);
  route.get(handler)
  return this
}
```

Although the above function has 2 arguments, it's similar to the the `app[method] = function(path){...}` definition. The second `handler` argument is obtained by calling `slice.call(arguments, 1)`.

>Long story short, `app.<method>` just stores the route in the applications router using its `route` method, then passes on the `handler` to `route.<method>`

The routers `route()` method is defined in [lib/router/index.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/index.js#L491):

```js
// proto is the prototype definition of the `_router` object
proto.route = function route(path) {
  var route = new Route(path);

  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};
``` 

Unsurprisingly, the `route.get` method, is defined in a similar way to `app.get` in [lib/router/route.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/route.js#L192) :

```js
methods.forEach(function (method) {
  Route.prototype[method] = function () {
    // `flatten` converts embedded arrays, like [1,[2,3]], to 1-D arrays ([1,2,3])
    var handles = flatten(slice.call(arguments));

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];
      
      // ...
      // For every handler provided to a route, a layer is created
      // and pushed into the routes stack
      var layer = Layer('/', {}, handle);

      // ...

      this.stack.push(layer);
    }

    return this;
  };
});
```

Each route can have multiple handlers, and constructs a `Layer` from each handler, which it then pushes on to a stack.

### Layers

Both the `_router` and `route` use a type of object called `Layer`. We can get an idea of what a layer does by seeing its [constructor definition](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/layer.js#L33):

```js
function Layer(path, options, fn) {
  // ...
  this.handle = fn;
  this.regexp = pathRegexp(path, this.keys = [], opts);
  // ...
}
```

Each layer has a path, some options and a function to be handled. In the case of our router, this function is `route.dispatch` (we will get to what this method does in a later section. It is something like passing on the request to the individual route). In the case of the route itself, this function is the actual handler function defined in our example code.

Each layer also has a [handle_request](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/layer.js#L86) method, which actually _executes_ the function passed during the Layers initialization.

Let's recap what happens when you create a route using the `app.get` method:

1. A route is created under the applications router (`this._router`)
2. The routes `dispatch` method is assigned as the handler method to a layer, and this layer is pushed to the routers stack.
2. The request handler itself is passed as the handler method to a layer, and this layer is pushed to the routes stack

In the end, all your handlers are stored inside the `app` instance as layers which are inside the routes stack, whose `dispatch` methods are assigned to layers that are inside the routers stack:

![creating routes](/assets/images/posts/express-internals/express-routing.svg)

Handling an HTTP request once it comes in takes a similar part, and we will get to that [in a bit](#handling-an-http-request)

## Starting the HTTP server

After setting up the routes, the server has to be started. In our example, we call the `app.listen` method, with the port number, and callback function as the arguments. To understand this method, we can see [lib/application.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/application.js#L616). The gist of it is:

```js
app.listen = function listen() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```

Looks like `app.listen` is just a wrapper around `http.CreateServer`. This makes sense, because if you recall what we saw in the [first section]((())), `app` is actually a function with a signature of `function(req, res, next) {...}`, which is compatible with the arguments required by `http.createServer` (which has the signature `function (req, res) {...}`).

It makes things much simpler when you realize that, in the end, everything that express.js provides can be summed up as just a really smart handler function.

## Handling an HTTP request

Now that we know that `app` is just a plain old request handler, let's follow an HTTP request as it makes it's way through the express application, and finally lands up inside the handler that we have defined.

From the `createApplication` function in [lib/express.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/express.js#L38) :

```js
var app = function(req, res, next) {
    app.handle(req, res, next);
};
```

The request goes to the `app.handle` method defined in [lib/application.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/application.js#L158):

```js
app.handle = function handle(req, res, callback) {
  // `this._router` is where we declared the route using `app.get`
  var router = this._router;

  // ... 

  // The request goes on to the `handle` method
  router.handle(req, res, done);
};
```

The `router.handler` method is defined in [lib/router/index.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/index.js#L136):

```js
proto.handle = function handle(req, res, out) {
  var self = this;
  //...
  // self.stack is where we pushed all our layers when we called 
  var stack = self.stack;
  // ...
  next();

  function next(err) {
    // ...
    // Get the path name from the request.
    var path = getPathname(req);
    // ...
    var layer;
    var match;
    var route;

    while (match !== true && idx < stack.length) {
      layer = stack[idx++];
      match = matchLayer(layer, path);
      route = layer.route;

      // ...
      if (match !== true) {
        continue;
      }
      // ... some more validations to check HTTP methods, headers, etc
    }

   // ... more validations 
   
    // process params parses the requests parameters... not important for now
    self.process_params(layer, paramcalled, req, res, function (err) {
      // ...

      if (route) {
        // once the params are done processing, the `layer.handle_request` method is called
        // It is called with the request, as well as this `next` function as well
        // this means that `next` will bbe called all over again once the current layer is handled
        // so requests will move on the the next layer when the `next` function is called again
        return layer.handle_request(req, res, next);
      }
      // ...
    });
  }
};
```

In short, the `router.handle` function loops through all the layers in its stack, until it finds one that patches the path of the request. AIt then eventually calls the layers `handle_request` method, which executes the layers pre-defined handler function. This handler function is the routes `dispatch` method, defined in [lib/router/route.js](https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/route.js#L98):

```js
Route.prototype.dispatch = function dispatch(req, res, done) {
  var stack = this.stack;
  // ...
  next();

  function next(err) {
    // ...
    var layer = stack[idx++];

    // ... some validations and error checks
    layer.handle_request(req, res, next);
    // ...
  }
};
```

Similar to the router, each route loops through all its layers, and calls their `handle_request` methods, which execute the layers defined handler method, which in our case is the request handler that we defined in our application code. Finally, the HTTP request comes into the realm of our application code.

![journey of an http request](/assets/images/posts/express-internals/express-routing-http.svg)

## Everything else

Although we have seen the core of how the express library makes your web server work, theres a lot more that it provides you. We skipped over all the sanity checks and validations done before the request gets passed on to your handler, we also didn't go through all the helper methods that come with the `req` and `res` request and response variables. Finally, one of the most powerful features of express is its use of middleware, which can help with anything from request body parsing to full blown authentication.

Hopefully, this post helped you in understanding the important aspects of the source code, which you can use to understand the rest of it.

If there are any libraries or frameworks whose internal workings you feel deserve an explanation, let me know in the comments.