---
layout: post
title:  "Why redux?"
date:   2016-02-23 18:45:12
categories: redux
comments: true
author: Soham Kamani
---
# Introduction to Redux

So there's this great new library called [redux](http://redux.js.org/) which has been making rounds recently for all the right reasons. But why are developers so crazy about redux and why should you consider using redux in your next application? This post will go through what makes redux a good choice and make a small application using redux and its principles.

Redux is based on three main principles :

1. **Every app has a single store** - The "store" is where the state of your application is stored. Your app must have its entire state in exactly one store. This is because there has to be a *single source of truth* that renders the rest of your application. What this means is that if theres something that doesn't look right in your app, its easier to track the source of the bug, because you know exactly where the state of each component is coming from.

2. **The application state is immutable** - Once you have set your application state, it cannot be mutated again. This doesn't mean your application can't be dynamic. State can only be changed through actions and reducers(explained below), in which case you have to recompute the new state of the application each time, and not change the existing state. Immutable state is better for your application, because every time, there is a new state, your application gets notified and can re-render accordingly. In this way, you are guaranteed to have your application showing a visual representation of your state at any point in time.

3. **All reducers are pure functions** - As stated before, the only way you can change the state of your application is to recompute the new state from the old state. This is done with a *reducer* which is nothing more than a function which takes two arguments (that is the previous state and the action required) and returns the new application state. The most important concept here is that all reducers *must be* [pure functions](http://www.sitepoint.com/functional-programming-pure-functions/). If your reducer is doing anything outside the function scope, it's possible you're doing it wrong.

## Writing reducers

The standard format of a reducer is :

```js
const myReducer = (state = defaultValue, action) => {
  /*
  perform some calculations based on action and old state.
  newState !== state
  */
  return newState;
};
```

Using this format, let us try to write a reducer for a simple counter :

```js
const counter = (state = 0, action) => {
  const { type } = action;
  switch (type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state + 2;
    default:
      return state;
  }
};
```
- The `state` variable is the original state passed to the reducer, we are giving a default value of 0 in case this is the first time the reducer is called.
- The `action` argument is an object which contains a `type` attribute, describing the kind of change we want in our state.
- If the action is of type `INCREMENT` we return the state increased by one, and decrease the state by one for type `DECREMENT`.
- If the type of action passed is unrecognized, we just return the state as it is. This is an important concept to remember, as it will become very important once the application grows in size.

## Writing an application using the reducer

So far, there has been no mention of redux, only of reducers. We would need redux now, as a glue to bridge our business logic (the counter reducer) to the store and the application state.

In order to make our application, we will be using npm and ES6 modules. You can bootstrap a project easily using a yeoman generator [like this one](https://github.com/sohamkamani/generator-webpack-quick#readme).

Install redux and react using :
```sh
npm install --save redux
```

Create the counter store :

```js
import { createStore } from 'redux';
const store = createStore(counter);
```

In our html file, we will add a simple interface for our counter :

```html
<html>

<head>
  <title>My App</title>
</head>

<body>
  <div id="counter-display">
  </div>
  <button id="counter-increment"> + </button>
  <button id="counter-decrement"> - </button>

  <script src="bundle.min.js"></script>
</body>

</html>
```

Next, lets create a render method and subscribe our store to it, such that it is called everytime the state of the store is changed :

```js
const counterDisplay = document.getElementById('counter-display');
const render = () => {
  counterDisplay.innerHTML = store.getState();
};

store.subscribe(render);
render();
```

We also call the render method once in the beggining to render the app initially.

Now we will add event listeners to the increment and decrement buttons to dispatch events everytime they are clicked :

```js
const incrementButton = document.getElementById('counter-increment');
const decrementButton = document.getElementById('counter-decrement');

incrementButton.addEventListener('click', ()=>{
  store.dispatch({type : 'INCREMENT'});
});

decrementButton.addEventListener('click', ()=>{
  store.dispatch({type : 'DECREMENT'});
});
```

Now we have a fully functioning counter. The data flow in out counter is as follows :

1. User clicks a button (increment or decrement).
2. The event listener dispatches an event, with a type of either `INCREMENT` or `DECREMENT` based on the button clicked.
3. The reducer re-computes the state of the store depending on the action type.
4. Since there is a new state, the `render` function, which was subscribed to the state, is called.
5. The render method gets the current state from the store and changes the contents of the DOM.

The source code for this application can be found [here](https://github.com/sohamkamani/blog-example__redux-counter) and the working example can be seen [here](http://www.sohamkamani.com/blog-example__redux-counter/).

## Redux developer tools

One of the many reasons redux is so great is because of the many developer tools available. [This one](https://github.com/gaearon/redux-devtools) is written by the creator of redux himself. A few of the reasons you should consider incorporationg developer tools into your development are :

1. They provide a way to constantly monitor your state. No more pesky `console.log`s to check what your current state is.
2. You can see exactly which action changed the state. Theres no more guesswork. If the state has been changed, you now know exactly when and why it was changed.
3. You can *change the past*. Yes, you heard that right. The redux developer tools gives you the option of removing an action you may have performed some time ago, and recomputes the state to show you the current state of the application, as if that action had never been performed in the past.

For small scale applications, redux dev tools provide an easy an convenient way to debug and inspect your application, and for larger applications, I would go so far as to say they are *required*.
