---
layout: post
title: An incremental tutorial to promises in javascript 🐾
date: 2016-08-28T00:45:12.000Z
categories: javascript promises beginners guide tutorial
comments: true
---

1. What do I need to know to go through this guide?
1. What is an async action?
1. What are promises and why do I need them?
1. How do I call another promise after my first one finishes?
1. How do I call multiple promises at the same time, and execute a piece of code after all of them finish?
1. How do I create my own promise?
1. I want to transform a resolved value from a promise, before passing it on to the promise chain. What do I do?
1. I want to execute 3 promises in sequence. I want to construct my third promise based on the results of both the first and second promise. What do I do?
1. I really like promises, but many libraries I have make use of callbacks. Can I transform these to promises?
1. I want to conditionally execute a promise, and return a synchronous value if the condition is not satisfied. However, there is another promise down the chain. How do I deal with this?
1. Promises still seem pretty awkward. Any cooler alternatives?

## 1. What do I need to know to go through this guide?

This article is about promises in _javascript_, so a basic knowledge of javascript is the minimum that is required. Promises are all about making async actions easier, so in order to really appreciate them, you should have at least worked with _some_ kind of async actions in javascript.

But don't worry... if you've ever written an event listener or made an ajax request, then you are already working with async code! If not, the next question is here to help!

It's also worth noting that this guide is written in ES6 (the latest version of javascript as of this writing). In a few examples, you also might see the use of the CommonJs `require` function. This is more for including some libraries that help us illustrate promises, and as such you don't really have to know much about it.

## 2. What is an async action?

Most of the code written in javascript is synchronous (read "normal"), which means that each statement is executed one after the other.  
Sometimes we need to execute some code only after an occurrence of some event (like when someone clicks a button, or when the database finally responds to our query). We cannot always wait for these events to complete, because it takes time... time that we can otherwise use to execute some other code. This code which we execute only once something happens and not along with the other synchronous code, is called asynchronous code.

>💡 Remember : although async code is executed at a different time than the synchronous code, that doesn't mean its executed on another thread. You can read more detials about this [here](/blog/2016/03/14/wrapping-your-head-around-async-programming/)

### Our first async action

Let's get started with a simple example : fetching the Google homepage!

```js
//This is just how we include the library we want in CommonJs syntax
const request = require('superagent')

//We send a request to get googles home page
request.get('http://www.google.com/',(err, res)=> {
  // We are now inside the callback! this only gets called once the request finishes
  if(err){
    // In case something goes wrong, we handle it here
    console.error(err)
  }

  // Once we get the response, we print it to the console
  console.log(res.text)
})
```

The `(err, res)` function argument pattern is the standard signature of a callback in javascript (That standard being that the error is always the first argument, followed by the rest of the arguments, which can be the data or response).

>💡 We are going to be using the [superagent](https://www.npmjs.com/package/superagent) library throughout this series. This is because it supports async callbacks as well as promises.

## 3. What are promises and why do I need them?

The Promise is the new standard way of handling async actions, officially introduced as a part of ES6. You can think of a promise as something that represents a future value (and this is actually the definition given in most places), but really, its just a fancier way of handling async actions like the one we just saw above. In fact, lets see how the "Promisified" version of fetching a page from google looks like :

```js
request.get('http://www.google.com/')
  .then((res)=> {
    // Once we get the response, we print it to the console
    console.log(res.text)
  })
  .catch(err => console.error(err))
```

The signature of a promise is it's `then` method. In fact, a good way to test if a variable `x` is a promise is to check the condition :

```js
typeof x.then === 'function'
```

What we are doing differently in this case, is that instead of passing our callback as an argument of the `request.get` method, we are instead _passing it as an argument of the `then` method of the promise that it returns_.

The callback format we just saw in the previous example is fine if we are building a small application with no other async actions, and as such we don't _really_ require promises in this case. The trouble comes when you have multiple async actions and you need to manage everything without going insane. More about this in the next section.

## 4. How do I chain another promise after my first one finishes?

Promise chaining is, in my opinion, the primary reason why promises relieve you from what is otherwise known as [callback hell](http://callbackhell.com/).

For the next example, we would like to fetch googles homepage and print the contents (just like before), but we would also like to fetch and print the contents of the bing homepage right after.

Let's take a look at how we would do this in callback world :

```js
const request = require('superagent')

request.get('http://www.google.com/', (err, res) => {
  if (err) {
    console.error(err)
  }

  console.log(res.text)

  //We call the second request inside the first ones callback, because we want to fire it only after we get the results of the first request
  request.get('http://www.bing.com/', (err, res) => {
    //We have to check for errors each time we make a request
    if (err) {
      console.error(err)
    }

    console.log(res.text)
  })
})
```

Now let's compare this to its promisified version :

```js
request.get('http://www.google.com/')
  .then((res)=> {
    console.log(res.text)
    return request.get('http://www.bing.com/')
  })
  .then((res)=> {
    console.log(res.text)
  })
  .catch(err => console.error(err))
```

We can generalize this and write it more generically :

```js
myFirstPromise
  .then((res)=> {
    /*
    Do something with the result of the first promise
    */
    return mySecondPromise
  })
  .then((res)=> {
    /*
    Do something with the result of the second promise
    */
  })
  .catch(err => console.error(err))
```

We can already see why promises are so useful :

1. __Promises need not be embedded inside each other.__ They are linearly chained, and so will never lead you to callback hell. Just one level of indentation per promise chain! Sweeeeet.
2. __Common error handling__. We don't need to check for errors after each promise like we did with callbacks. Just one error check per promise chain. Awesome!

Understanding why promises chain is the key to understanding promises themselves. So, in the next section, we are going to deep dive into the `then` method.

## 5. What does a promise return?

One thing to remember is that a promise doesn't return anything useful. If were talking about the useful data we get at the end of a promise, that's what the promise _resolves_ to.

>💡 We always say that promises resolves to a value. This is the future value that they represent.

For example a promise like this :

```js
somePromise
  .then(val => {
    /*...*/
  })
```

We say that `somePromise` resolves to the value represented by `val`. In our previous examples the promise that requests for the google homepage resolves to the string of google homepage html source code.

Every promise has a `then` method. And this `then` method, on being called always returns another promise.

Take a moment to think about what this means. If each promise has a `then` method, and each `then` method returns another promise, then that means that it's possible to infinitely chain the `then` method. And this is indeed the case. In fact, if we re-wrote our previous example to look like :

```js
//A blank function
const nothing = ()=>{}

request.get('http://www.google.com/')
  .then((res)=> {
    console.log(res.text)
  })
  .then(nothing)
  .then(nothing)
  .then(nothing)
  .then(()=> request.get('http://www.bing.com/'))    
  })
  .then((res)=> {
    console.log(res.text)
  })
  .catch(err => console.error(err))
```

...we would still get the same result as before. Now, what im about to say might be a little confusing, but bear with me :

1. _The `then` method of a promise returns another promise that resolves to the value returned by its callback_
2. _A promise (A) that resolves to another promise (B), actually resolves to the value resolved by that promise (B)_

Let's look at examples to understand these 2 points :

```js
const aNewPromise = originalPromise.then(someValue=>{
  return 'foo'
})

aNewPromise.then(newValue => {
  console.log(newValue)
})
// 'foo' is printed on to the console

const containerPromise = anotherPromise.then(someValue=>{
  return aNewPromise
})

containerPromise.then(newValue => {
  console.log(newValue)
})
// 'foo' is printed on to the console
```

`aNewPromise` resolves to "foo", which is the value returned by the callback of `originalPromise`'s `then` method.(point 1)  

`containerPromise` also resolves to "foo", but in this case `containerPromise` actually resolves to `aNewPromise`, which resolves to "foo". (point 2)
