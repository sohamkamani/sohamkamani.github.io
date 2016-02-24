---
layout: post
title: ES7 - What to expect?
date: 2015-12-28T18:45:12.000Z
categories: es7
comments: true
---

Now that ES6 has been officially accepted, its time to look forward to the *next* iteration of javascript, that is ECMAScript 7. There are a lot of new and exciting features that ES7 brings along with it.

## Support for asynchronous programming

Of all the new features in ES7, the most exciting one, in my view, is the addition of `async` and `await` for asynchronous programming, which occurs quite often, especially when you're trying to build applications using Node.js. To explaing async and await, it's better if we see an example first. Lets say we have 3 asynchronous operations, each one dependant on the result returned by the previous one. There are multiple ways we could do that. The most common way to do this is to utilize callbacks, lets take a look at the code :

```js

myFirstOperation(function(err, firstResult){
  mySecondOperation(firstResult, function(err, secondResult){
      myThirdOperation(secondResult, function(err, thirdResult){
        /*
        Do something with the third result
        */
      });
  });
});
```

The obvious flaw with this approach is that it leads to a situation known as [callback hell](http://callbackhell.com/). The introduction of promises simplified async programming greatly, lets see how the code would look using promises (that were introduced with ES6).

```js
myFirstPromise()
.then(firstResult => mySecondPromise(firstResult))
.then(secondResult => myThirdPromis(secondResult))
.then(thirdResult =>{
  /*
  Do something with thrid result
  */
}, err => {
  /*
  Handle error
  */
});
```

Now lets see how we would handle these operations using `async` and `await`

```js
async function myOperations(){
  const firstResult = await myFirstOperation();
  const secondResult = await mySecondOperation(firstResult);
  const thirdResult = await myThirdOperation(secondResult);
  /*
  Do something with third result
  */
};

try {
  myOperations();
} catch (err) {
  /*
  Handle error
  */
}
```

> What? but this looks just like synchronous code?

Exactly! The use of `async` and `await` makes our life much simpler, by making async functions *seem* as if they are synchronous code. Under the hood though, all these functions execute in a non blocking fashion, so you have the benefit of non-blocking async fucntions, with the simplicity and readability of synchronous code. Brilliant!

## Object rest and Object spread

In ES6 we saw the introduction of Array rest and spread operations. These new additions made it easier for us to combine and decompose arrays. ES7 takes this one level further by providing similar functionality for objects.

### Object rest

This is a extension to the existing ES6 destructuring operation. On assignment of the properties during destructuring, if there is an additional `...rest` parameter, all the remaining keys and values are assigned to it as another object.

For example :

```js
const myObject = {
  lorem : 'ipsum',
  dolor : 'sit',
  amet : 'foo',
  bar : 'baz'
};

const { lorem, dolor, ...others } = myObject;

// lorem === 'ipsum'
// dolor === 'sit'
// others === { amet : 'foo', bar : 'baz' }
```

### Object spread

This is similar to object rest, but used for constructing objects instead of destructuring them.

```js
const obj1 = {
  amet : 'foo',
  bar : 'baz'
};

const myObject = {
  lorem : 'ipsum',
  dolor : 'sit',
  ...obj1  
};

/*
myObject === {
  lorem : 'ipsum',
  dolor : 'sit',
  amet : 'foo',
  bar : 'baz'
};
*/
```

This is an alternative way of expressing the `Object.assign` function already present in ES6. In the above code, myObject, is a new object, constructed using some properties of obj1 (there is no reference to `obj`).

The equivalent way of doing this in ES6 would be :

```js
const myObject = Object.assign({
  lorem : 'ipsum',
  dolor : 'sit'
}, obj1);
```

Of course, the object spread notation is much more readable, and the recommended way of assigning new objects, if you choose to adopt it.

## Observables

The `Object.observe` function is a great new addition for asynchronously monitoring changes made to objects. Using this feature, you would be able to handle any sort of change made to objects, along with seeing how and when that change was made.

Lets look at an example of how `Object.observe` would work :

```js
const myObject = {};

Object.observe(myObject, (changes) => {
  const [{ name, object, type, oldValue }] = changes;
  console.log(`You tried to ${type} the ${name} property`);
});

myObject.foo = 'bar';
//You tried to add the foo property
```
### Caveat
Although this is a good feature, as of this writing, `Object.observe` is being tagged as [obsolete](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/observe), which means that this feature could be removed at any time in the future. While its still ok to play around and experiment with this, it is recommended *not to use it* in production systems, and larger applications.

## Additional utility methods

There have been additional methods added to the `String` and `Array` prototypes.

1. `Array.prototype.includes` - Checks if an array includes an element or not.

    ```js
    [1,2,3].includes(1); //true
    ```

2. `String.prototype.padLeft` and `String.prototype.padRight` -

    ```js
    'abc'.padLeft(10); //"abc       "
    'abc'.padRight(10); //"       abc"
    ```

3. `String.prototype.trimLeft` and `String.prototype.trimRight` -

    ```js
    '\n \t   abc \n  \t'.trimLeft(); //"abc \n  \t"
    '\n \t   abc \n  \t'.trimRight(); //"\n \t   abc"
    ```

## Working with ES7 today

Many of the features mentioned above are still in the proposal phase, but you can still get started using them in your javascript application *today*!     
The most common tool used to get started is [babel](https://babeljs.io/). In case you want to make a browser application, babel would be perfect to compile all your code to regular ES5. Alternatively, you could use the many [babel plugins](https://babeljs.io/docs/setup/) already available to use babel with your favorite toolbelt or build system. In case you have trouble setting up your project, there are many [yeoman generators](https://github.com/sohamkamani/generator-webpack-quick) to help you get started.   
If you are planning to use ES7 to build a node module or an application in node, there is a [yeoman generator](https://github.com/sohamkamani/generator-nm-es6) available for that as well.
