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
1. How do I use a promise?
1. How can I combine promises with the rest of my synchronous code?
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
