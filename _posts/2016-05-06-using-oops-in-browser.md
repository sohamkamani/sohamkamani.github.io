---
layout: post
title: Rendering DOM elements with object oriented programming 🔵
date: 2016-05-06T08:45:12.000Z
categories: javascript nodejs object oriented dom
comments: true
---

It's perplexing that the javascript language has so many unique object oriented features, but that we don't use them nearly enough to unlock their full potential. In this post, we will go through how we can make use of inheritance and polymorphism to render browser DOM components. If you want an introduction or recap to object-oriented principles in javascript, be sure to check out my [other blog post](/blog/2016/04/30/oops-in-js/).
<!-- more -->
In todays world of limitless frameworks and libraries, it helps to get back to the roots and learn how to utilize the language's good parts to build scalable front end solutions, so there will be no jQusery, angular, or react used for this post, just plain old vanilla js.  

*Note - We will be using [ES6](http://es6-features.org/#Constants) throughout this post*

## The situation

Let's suppose we have list of to-do items. Some of them are regular plain items, some are completed (green and strike-through),and some are urgent (red and bold). However, all of them will have a certain font size, font style, and padding, and they are all to be programmatically generated.

I am going to leave out the logic of adding and removing to-dos (which you can see [here](http://todomvc.com/) if you want), and just focus on rendering the DOM elements.

## The layout

Our app is just a simple unordered list :

```html
<ul id="my-list">
</ul>
```

## The base list item

```js
const ListItem = (text) => {
  const domElement = document.createElement('li');
  const textNode = document.createTextNode(text);
  domElement.appendChild(textNode);
  domElement.classList.add('list-item');
  return {
    domElement
  };
};
```

Pretty simple, we are making a constructor which will return an object containing the domElement, and add a base class to it for styling.

## The modified list items

We will now create two different types of list items, which all inheirt their properties from the parent `ListItem`

```js
const CompletedListItem = (text) => {
  const superObject = ListItem(text);
  const {domElement} = superObject;
  domElement.classList.add('completed');
  return superObject
};

const UrgentListItem = (text) => {
  const superObject = ListItem(text);
  const {domElement} = superObject;
  domElement.classList.add('urgent');
  return superObject;
};
```

## The stylesheet

We have different classes for each type of list item, so lets structure our css with some basic styling for all our list items, and override some of it for the modified list items.

```css
.list-item {
  font-size: 1.2em;
  color : black;
}

.completed {
  text-decoration: line-through;
  color: green;
}

.urgent {
  font-weight: bold;
  color: tomato;
}
```

## Creating and adding list items

Now that we have all our elements' constructors in place, we can add list items as needed :

```js
const myList = document.getElementById('my-list');
myList.appendChild(ListItem('This is a regular list item').domElement);
myList.appendChild(CompletedListItem('This is a completed list item').domElement);
myList.appendChild(UrgentListItem('This is an urgent list item').domElement);
```

## The advantage of using an object oriented approach

The alternative to using this approach would be an if else branch in our base `ListItem` constructor, modifying the item based on a second `type` argument... sometinhg like this :

```js
const ListItem = (text, type) => {
  const domElement = document.createElement('li');
  const textNode = document.createTextNode(text);
  domElement.appendChild(textNode);
  domElement.classList.add('list-item');

  if(type === 'urgent'){
    domElement.classList.add('urgent');
  } else if(type === 'completed'){
    domElement.classList.add('completed');
  }
  return {
    domElement
  };
};
```

This approach may *look* fine for now, but it would quickly become a nightmare when the difference between each list item increased, or if we had many other types of list items. **Maintaining a giant if-else chain is never a good idea**.  

Additionally, polymorphism is **composable**, which means you could have modifications of an `UrgentListItem` like a `SuperUrgentListItem` which has everything the urgent list item has, but with an additional "(urgent)" text next to the list item:

```js
const SuperUrgentListItem = (text) => {
  const superObject = UrgentListItem(text);
  const {domElement} = superObject;
  const urgentTextNode = document.createTextNode('(urgent)');
  domElement.appendChild(urgentTextNode);
  return superObject;
};
```

If you try to do this using branches, you would end up (*gasp*) nesting your if-else conditions, which is almost always a nightmare.

If you're using a module loader like [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/), this pattern is especially useful because it allows you to isolate each DOM element as a separate module (A practice used in libraries like [react](https://github.com/facebook/react)).

You can find the working demo of this whole example [here](/assets/other/oops-in-the-browser-demo-transpiled.html) and the full source code [here](https://github.com/sohamkamani/sohamkamani.github.io/blob/master/assets/other/oops-in-browser-demo.html).
