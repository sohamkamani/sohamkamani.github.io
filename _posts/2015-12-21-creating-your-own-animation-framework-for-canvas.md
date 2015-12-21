---
layout: post
title:  "Creating a mini animation framework for HTML Canvas"
date:   2015-12-21 18:45:12
categories: canvas animation
comments: true
author: Soham Kamani
---

The HTML ```<canvas>``` element is good for many things, one of them being animation. But often times, the code you write to implement this animation can at times get a litte messy, to put it politely. To get an idea of what I mean by this, take a look at [this simple example](http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/) which shows you the most basic animation of moving a rectangle in one dimension from one point to the other. Although the code in that example is not *that* complex, once you try to imagine adding another square or circle in there, or changing the motion from a straight line to a curve, you can see how the complexity adds  up and how it would be a nightmare to implement. This article would brief you on how to use object - oriented programming in javascript in the latest standard (ES6) to make animation in canvas less of a headache.

## Project Structure and prerequisites

Most browsers don't support all the specifications of ES6, so we would have to set up a build environmet that would transpile all our ES6 code into ES5. Fortunately this is really easy to do and there are a lot of awesome tutorials out there to help you get set up.

Our source file structure will look something like this :

## Building Blocks

Lets see a top-down approach to making our animation more manageable. Firstly, we need a renderer. This will be responsible for updating and painting all our components on to the canvas. Nothing more, nothing less.

{% highlight javascript %}
'use strict';

let Renderer = function(canvasId){
  const canvas = document.getElementById(canvasId);
  let self = this;
  self.canvas = canvas;
  self.ctx = canvas.getContext('2d');
  self.components = [];
};

module.exports = Renderer;

Renderer.prototype.addComponent = function(drawObject){
  this.components.push(drawObject);
};

Renderer.prototype.update = function(){
  this.components.forEach(component => {
    component.update();
  });
};

Renderer.prototype.paint = function(){
  let self = this;
  self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
  self.ctx.beginPath();
  this.components.forEach(component => {
    component.draw(self.ctx);
  });
  self.ctx.stroke();
};
{% endhighlight %}

The ```Renderer``` has a constructor 3 methods :

- **constructor** - Initializes the canvas element to be used for drawing.
- **addComponent** - Pushes a "Component" into a list of components to be drawn.
- **update** - Calls the update method of each component and 
