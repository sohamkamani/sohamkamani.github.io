---
layout: post
title: Object oriented programming in javascript 🐶
date: 2016-04-30T08:45:12.000Z
categories: javascript nodejs object oriented
comments: true
---

Javascript is a [multi paradigm programming language](https://developer.mozilla.org/ar/docs/multiparadigmlanguage.html) and has object-oriented, functional, and imperative properties that make it very flexible, because of which you can see a countless number of design patterns being implemented using javascript, and which is also the reason why it's so powerful.

This post will go through what makes javascript a powerful object oriented language, by showing common OOP features implemented in javascript, as well as a few niche features that can be implemented due to its flexibility.  
<!-- more -->  

1. [Objects](#objects)
2. [Classes](#classes)
3. [Encapsulation and abstraction](#encapsulation)
4. [Composition](#composition)
5. [Inheritance](#inheritance)
6. [Polymorphism](#inheritance)

*Note - We will be using [ES6](http://es6-features.org/#Constants) throughout this post*

<a name="objects"></a>  
  

## Objects

It's hard to argue against javascript being an object oriented language when *almost everything is an object*. Besides the [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types, everything in javascript is an object. It almost seems stupid as to how easy it is to create a basic object :

```js
const o = {};
```

As in other OOP languages, objects can have properties and methods.

```js
const dog = {
  name : 'Fido',
  breed : 'Collie',
  bark : function(){
    console.log('Woof!');
  }
};
```

Here `name` and `breed` are properties and `bark` is a method of `dog` which is our object.

<a name="classes"></a>  

## ~~Classes~~ Constructors

***Javascript does not have classes***. There have been many attempts to mimic classes in javascript, and there is even a `Class` in ES6, however, all these "replacements" are just syntactic sugar over the actual functionality that goes on under the hood. The closest thing that resembles classes are constructor functions, in the sense that they act as *blueprints* for the objects they return.

There is more than one way to make a constructor, so let us look at the different options we have for making a constructor of the `dog` object we just saw :

Method #1 - Using `this`, `prototype` and `new` :

```js
const Dog = function(name, breed){
  this.name = name;
  this.breed = breed;
};

Dog.prototype.bark = function(){
  console.log('Woof!');
};

const dog = new Dog('Fido', 'Collie');
```

Method #2 - Using closures :

```js
const Dog = (name, breed) => {
  const bark = () => console.log('Woof!');
  return {
    name, breed, bark
  };
}

const dog = Dog('Fido', 'Collie');
```

Method 1 and 2 will give you the same result, with the distinction that for method 2, we will be declaring the `bark` method for every instantiation, as opposed to storing it in the prototype like #1. This may be an issue for memory sensitive applications, but for most of the applications out there, you should prefer #2 as its more readable, and you don't have to deal with `this` and `new`.

<a name="encapsulation"></a>  

## Encapsulation and abstraction

> **Encapsulation** is a concept that binds together the data and functions that manipulate the data, and that keeps both safe from outside interference and misuse.

> Through the process of **abstraction**, a programmer hides all but the relevant data about an object in order to reduce complexity and increase efficiency

Let's see how we would implement encapsulation and abstraction for our dog. We will give our constructor an additional argument, that will describe the sound our dog will make when it barks.

```js
const Dog = (name, breed, sound) => {
  const bark = () => console.log(sound);
  return {
    name, breed, bark
  };
}

const dog = Dog('Fido', 'Collie', 'Grrrr');
```

Now if you execute `dog.bark()`, you will see `Grrrr` printed on the console. However, we dont have access to the `sound` variable even though our `bark` method is using it. This is also known as a closure in javascript, and it is how we implement encapsulation and abstraction. We are *binding together the `bark` method and its data (`sound`), and we do not grant access to `sound` outside of the constructor function scope.*

<a name="composition"></a>  

## Composition

Composition is how we express all our "has a" relationships. A dog *has a* collar. A dog *has a* tail. If we were being overly explicit, each dog object would *contain* individual collar and tail objects.

Lets start with the simplest way of implementing object composition, which will also go to demonstrate how easy it is to do this in javascript :

```js
//Direct Assignment :
const dog = {
  name : 'Fido',
  breed : 'Collie',
  collar : {
    color : 'red',
    shape : 'pendant'
  },
  tail : {
    length : {
      value : 10,
      unit : 'cm'
    },
    status : 'wagging'
  }
};
```

The above snippet will create a new object for our dog variable. This new object will *have* new objects for both the `tail` and `collar` keys. There is another level of composition for our dogs `tail` - it has a `length` object, which is defined by its `value` and `unit` keys.

Lets look at the programmatic way of achieving the same thing :

```js
const Collar = ({shape='pendant', color='blue'}) => {
  return {
    shape,
    color
  };
};

const Length = ({value=0, unit='cm'}) => {
  return {
    value,
    unit
  };
};

const Tail = ({tailLength, status}) => {
  const length = Length({value : tailLength});
  return {
    length,
    status
  };
};

const Dog = (name, breed, sound) => {
  const bark = () => console.log(sound);
  const tail = Tail({
    tailLength : 10,
    status : 'wagging'
  });
  const collar = Collar({color : 'red'});
  return {
    name, breed, bark, tail, collar
  };
};

const dog = Dog('Fido', 'Collie', 'Grrrr');
```

Here we make use of default values for almost all our constructors.

<a name="inheritance"></a>  

## Inheritance and polymorphism

Inheritance is quite different in javascript as compared to other languages because of its prototypal approach to inheritance, what with no classes and all. In addition, like everything else, there are multiple ways to implement inheritance.

For these examples, lets consider a `Dog` and `Cat` constructor which both inherit their properties from an `Animal` constructor.

### Method #1 - Using `this`, `prototype` and `new` :

```js
const Animal = function(sound){
  this.sound = sound;
};

Animal.prototype.makeSound = function(){
  console.log(this.sound);
};

const Dog = function(name, breed){
  this.name = name;
  this.breed = breed;
}

Dog.prototype = new Animal('woof');

const Cat = function(name, breed){
  this.name = name;
  this.breed = breed;
};

Cat.prototype = new Animal('meow');

const dog = new Dog('Fido', 'Collie');
const cat = new Cat('Oliver', 'Siamese');

dog.makeSound();
cat.makeSound();
```

This is perhaps the most commonly described way of implementing inheritance in different textbooks, but one limitation is that all properties stored in the objects prototype are shared among all objects. This means that if we created another instance of `Dog` (`dog2`), its `sound` property would be the equal to the `sound` of `dog`. This is ok for primitives which are passed by value, but can be problematic for references. It is therefore recommended to only store methods in the prototype. There is a way to get around this, which is :

### Method #2 - Using `Object.assign` with `this`, `prototype`, and `new`

```js
const Animal = function(sound){
  this.sound = sound;
};

Animal.prototype.makeSound = function(){
  console.log(this.sound);
};

const Dog = function(name, breed){
  const self = this;
  Object.assign(self, new Animal('woof'), Animal.prototype);
  self.name = name;
  self.breed = breed;
};

const Cat = function(name, breed){
  const self = this;
  Object.assign(self, new Animal('meow'), Animal.prototype);
  self.name = name;
  self.breed = breed;
};

const dog = new Dog('Fido', 'Collie');
const cat = new Cat('Oliver', 'Siamese');

dog.makeSound();
cat.makeSound();
```

[Object.assign](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) is quite a useful function for creating new objects. It may not be available in older browsers, so you might have to use a polyfill.  
Here, we form a new instance of the parent constructor for every instantiation of the child constructor. So we wouldn't be having the problem of multiple references to instance variables of the parent class like in the previous example.  
Although this method works just fine, I personally find it more developer-friendly to exclude the use of `this`, `prototype` and `new`, so lets look at a way to implement inheritance without them :

### Method #3 - Using `Object.assign` without `this`, `prototype`, and `new`

```js
const Animal = (sound) => {
  const makeSound = () => console.log(sound);
  return {
    makeSound
  };
};

const Dog = (name, breed) => Object.assign({
    name, breed
  }, Animal('woof'));

const Cat = (name, breed) => Object.assign({
    name, breed
  }, Animal('meow'));

const dog = Dog('Fido', 'Collie');
const cat = Cat('Oliver', 'Siamese');

dog.makeSound();
cat.makeSound();
```

Note that we are also changing the behavior here a little bit. Now `sound` is a private variable, and can only be accessed by the `makeSound` method. One tradeoff in using this method is that methods have to be redefined for each instantiation, since we are defining it within the constructor. This may lead to memory problems if you make an *extremely large* number on instances, but for most situations, you'll be fine. Also, you can't access any of `Animal`s private variables from `Dog`. In the end it's a tradeoff between readability and memory efficiency.

## Using these principles with the browser api

Using object oriented principles with javascript *may* seem straightforward, but can get a little tricky when used with the browsers DOM API. Do check out my [other post](/blog/2016/05/06/using-oops-in-browser/) on using these patterns along with the browsers API for some real world examples on using OOP with javascript.
