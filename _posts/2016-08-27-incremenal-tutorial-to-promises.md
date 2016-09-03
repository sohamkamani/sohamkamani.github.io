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

>💡 We are going to be using the [superagent](https://www.npmjs.com/package/superagent) library for making AJAX requests. This is because it supports async callbacks as well as promises.

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

One thing to remember is that a promise itself doesn't return anything useful. If were talking about the useful data we get at the end of a promise, that's what the promise _resolves_ to.

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

### It's easier with diagrams

`aNewPromise` calls `originalPromise`'s `then` method to return a new promise that resolves to "foo"

![diagram1](/assets/images/posts/promise-guide/pd1.svg)

`containerPromise` calls `anotherPromise`'s `then` method to return a new promise that resolves to `aNewPromise`

![diagram2](/assets/images/posts/promise-guide/pd2.svg)

But, we know that `aNewPromise` resolves to "foo", so we can expand its block to get the overall diagram :

![diagram3](/assets/images/posts/promise-guide/pd3.svg)

## 6. How do I create my own promise?

Until now, all the examples we have seen so far were of promises that were created using some external library. In this section, we are going to see how to make our own promises.  

For this example, we will make use of the most common async function in javascript : `setTimeout`, to create a promise. For this example, we want to resolve to the value "42", after 1 second. Here's how we would do that :

```js
const theAnswerToEverything = new Promise(resolve => {
  setTimeout(()=>{
    resolve(42)
  }, 1000)
})
```

Now, `theAnswerToEverything` is a promise that can be called like :

```js
theAnswerToEverything
  .then(answer => console.log(answer))
  //Prints 42
```

The general format for creating a promise is :

```js
const foo = new Promise((resolve, reject)=> {
  /*
  Do something asynchronous
  */
})
```

`resolve`, and `reject` are both functions.

The second argument, `reject`, is used for error handling. If the async operation you are attempting has a chance to fail, the `reject` function should be called with the error object thrown.

>But what if I just want to make a promise that just returns a plain old value?

It is sometimes required to just have a promise that resolves to a value immediately. Let's say we want to skip the timeout of 1 second and just have `theAnswerToEverything` resolve to 42 immediately. We can write something like this :

```js
const theAnswerToEverything = new Promise(resolve => {
  resolve(42)
})
```

...or, to make it even simpler, we can use the `Promise.resolve` shorthand :

```js
const theAnswerToEverything = Promise.resolve(42)
```

Both versions give us the exact same promise. So, if you're planning on wrapping a value in a promise, the recommended way is to use `Promise.resolve`

All versions of `theAnswerToEverything` can be shown as :

![diagram4](/assets/images/posts/promise-guide/pd4.svg)

## 7. What do I do in case an error shows up?

One crucial fact to remember about promises is that _they fail silently_. This, in my opinion, is probably not the best design choice, but is something that must always be kept in mind. Unless you explicitly _handle_ an error thrown in the middle of a promise, it will go unnoticed.

Fortunately for us though, handling errors in promises is _much_ easier that the old callback method (where each callback must handle its own error). In promises, things are done a bit differently : an error thrown anywhere in the promise chain, will trickle down to the last catch statement.

```js
promise1.then(()=>{
  //An error occurs after promise1
  throw new Error('I am an error')
})
.then(()=> {
  //This is not executed
  return promise2
})
.then(()=>{
  //Nor is this
  return promise3
})
.catch(err => {
  //The error thrown from promise1 is captured here, as it would be were it thrown from promise2 or promise3
  console.error(err)
})
```

>💡 Remember : As a rule of thumb, always append a `catch` method at the end of a promise chain, or else you will forever be doomed to never know why your code is failing


## 8. How do I execute promises in parallel?

It's actually quite easy to execute multiple promises in parallel. For this, we make use of the `Promise.all` function.

```js
const request = require('superagent')

const getGoogleHomePage = request.get('http://www.google.com/')
const getBingHomePage = request.get('http://www.bing.com/')

//Promise.all combines both our promises into another promise.
const getBothHomepagesInParallel = Promise.all([getGoogleHomePage, getBingHomePage])

getBothHomepagesInParallel
  .then(responses => {

    /*
    `responses` is an array of results :
    responses[0] is the result of just resolving `getGoogleHomePage`
    responses[1] is the result of just resolving `getBingHomePage`
    */

    //This prints the google home page
    console.log(responses[0].text)

    //This prints the bing home page
    console.log(responses[1].text)
  })
```

`Promise.all` combines the two promises (`getGoogleHomePage` and `getBingHomePage`), and returns another promise, which resolves to an array of results, which are in the same order as the original promises. You can combine as many promises as required in this fashion.

![diagram5](/assets/images/posts/promise-guide/pd5.svg) 

>💡 Remember : `Promise.all` initiates all its member promises at the same time, and the combined promise only resolves when __all__ its member promises have resolved.

In the above example, if `getGoogleHomePage` took 3 seconds to resolve, and `getBingHomePage` took 6 seconds to resolve, then `getBothHomepagesInParallel` would take 6 seconds to resolve.
