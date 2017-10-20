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

We will also be using a node module called [object-assign](https://www.npmjs.com/package/object-assign) a lot. This is just an implementation of the native Object.assign for environments that don't support it.

Our source file structure will look something like this :
```text
src
├── Component.js
├── Renderer.js
├── drawings
│   └── Square.js
├── index.js
└── motions
    └── LinearMotion.js
```

## Building Blocks

Lets see a top-down approach to making our animation more manageable. Firstly, we need a renderer. This will be responsible for updating and painting all our components on to the canvas. Nothing more, nothing less.

```js
//src/Renderer.js
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
```

The ```Renderer``` has a constructor 3 methods :

- **constructor** - Initializes the canvas element and 2d context to be used for drawing.
- **addComponent** - Pushes a "Component" into a list of components to be drawn.
- **update** - Calls the update method of each component.
- **paint** - Clears and repaints the canvas, by passing the context to the ```draw``` method of each component.

> **NOTE**
> We use polymorphism in javascript to achieve the functionality in ```Renderer```. We expect each ```Component``` object to have an ```update``` and a ```draw``` method, but each component will have its own implementation.

> **Simple english modelling** - A renderer *has a* bunch of components that it can update and draw on to the canvas.

Now that we have our renderer in place, we need to make the structure for a generic ```Component```, whose methods the renderer keeps calling so often.

```js
//src/Component.js
'use strict';

import assign from 'object-assign';

let Component = function(options){
  assign(this, options);
};

module.exports = Component;

Component.prototype.update = function(){
  let {motion, drawing} = this;
  motion.move();
  assign(drawing.position ,motion.getCurrentPosition());
};

Component.prototype.draw = function(ctx){
  let {drawing} = this;
  drawing.draw(ctx);
};
```

Pretty simple compared to Renderer. The constructor just assigns the options we pass it to ```this```.
Fundamentally, every component in animation will have two aspects that define it. The way it draws, and the way its state changes (in our case, this is represented by the way it moves, or its motion). ```motion``` and ```drawing``` are again two generic components, whose only requirement is that they implement a fixed set of methods. (```move``` and ```getCurrentPosition``` in the case of motion, and ```draw``` in the case of drawing).

> **Simple english modelling** - A component *has a* drawing, that it can draw on to the canvas, and a motion, which updates its position state.

In our example, we require a *square* which moves *linearly* (up and down a straight line).

Lets define a ```Square``` drawing and a ```LinearMotion```.
```js
//src/drawings/Square.js
'use strict';
import assign from 'object-assign';

let Square = function (options) {
  let self = this;
  assign(self, options);
};

module.exports = Square;

Square.prototype.draw = function (ctx) {
  let self = this;
  ctx.fillStyle = 'black';
  ctx.rect(self.position.x, self.position.y, self.width, self.height);
  ctx.fill();
};
```

Pretty self explanatory. A ```square``` implements a ```draw``` method which draws a square on to the canvas based on the options you give it. ctx here is the 2d canvas context.

```js
//src/motions/LinearMotion.js
'use strict';

import assign from 'object-assign';

let LinearMotion = function (options) {
  assign(this, options);
  this.isMovingForward = true;
  this.distance = this.distance || this.center ;
  this.speed = this.speed || 2 ;
};

module.exports = LinearMotion;

LinearMotion.prototype.move = function () {
  let {
    center, distance, speed, maxDistanceFromCenter
  } = this;
  if(this.isMovingForward){
    distance += speed;
  } else {
    distance -= speed;
  }

  let currentDistanceFromCenter = Math.abs(center - distance);
  if(currentDistanceFromCenter >= maxDistanceFromCenter ){
    this.isMovingForward = !this.isMovingForward;
  }

  this.distance = distance;
};

LinearMotion.prototype.getCurrentPosition = function(){
  let x = this.distance;
  return {
    x
  };
};
```

The ```move``` method of LinearMotion has a bit of math in it, but in a nutshell, we assign a "center" and a "maximum distance from the center". On each call of the ```move``` method, we advance the distance from the center by the assigned speed, and in the appropriate direction (positive or negative depending on the direction) If the distance exceeds the maximum distance from the center, we reverse the direction. This will result in a back and fourth movement about the center.

Finally, we implement the ```getCurrentPosition``` method to return only the ```x``` position as the resultant distance, meaning that our object will move back and fourth in the x direction.

## Putting it all together

Now that we have all our building blocks and framework ready, lets put it all together.

```js
//src/index.js
'use strict';

import Renderer from './Renderer';
import Component from './Component';
import Square from './drawings/Square';
import LinearMotion from './motions/LinearMotion';

//Initialize a new renderer. "myCanvas" is the id of our HTML canvas element.
const renderer = new Renderer('myCanvas');

//Initialize a new motion of type LinearMotion with center at 100pixels and maxDistanceFromCenter at 50 pixels
let motion = new LinearMotion({
  center : 100,
  maxDistanceFromCenter : 50
});

//Initialize a new Square with initial position at x = 100pixels and y= 10pixels
let square = new Square({
  width : 25,
  height : 25,
  position : {
    x : 100,
    y : 10
  }
});

//Initialize a new component and add it to the renderer.
//The component would have our LinearMotion object as its motion and our square as its drawing.
renderer.addComponent(new Component({
  motion,
  drawing : square
}));

// this render function calls the update and paint method of our renderer.
//"requestAnimationFrame" calls render 60 times each second, and is a native method present in browsers.
const render = ()=>{
  requestAnimationFrame(render);
  renderer.update();
  renderer.paint();
};
render();
```

And thats it! Now bundle and compile this file using your favorite module bundler and insert it into your ```index.html``` file.

```html```
<html>

<head>
  <title>My Canvas Animation</title>
</head>

<body>
  <canvas id="myCanvas" width="600px" height="400px"></canvas>
  <script src="bundle.js" ></script>
</body>

</html>
```

If all goes well, once you open your index.html file, you should get something that looks like this :

![Example Image](http://www.sohamkamani.com/blog-example__canvas-animation-framework/extras/images/square_linear.gif)

Pretty cool, but we still haven't seen the full power of organizing your code properly. Lets put in one more square, but this time, we want a more natural kind of motion. Something like how object moves when oscillating on a string. Lets make a new SpringMotion constructor for this.

```js
//src/motions/SpringMotion.js
'use strict';
import assign from 'object-assign';

let SpringMotion = function(options){
  assign(this, options);
};

module.exports = SpringMotion;

SpringMotion.prototype.move = function(){
  let {a, v, s, center, k} = this;
  v = v || 0;
  let distanceFromCenter = center - s ;
  a = k * distanceFromCenter;
  v += a;
  s += v;
  assign(this,{a, v, s});
};

SpringMotion.prototype.getCurrentPosition = function(){
  let {s} = this;
  return {
    x : s
  };
};
```

I won't get into the detail of this kind of motion as it involves a little bit of extra [theory](https://en.wikipedia.org/wiki/Hooke%27s_law) which could take a whole blog post on its own.
Now all we have to do to add a new square with this spring motion is to modify ```index.js``` by adding the following code :

```js
let springSquare = new Square({
  width : 25,
  height : 25,
  position : {
    x : 100,
    y : 40
  }
});

let springMotion = new SpringMotion({
    center: 100,
    s: 150,
    k: 3e-3
  });

renderer.addComponent(new Component({
  motion : springMotion,
  drawing : springSquare
}));
```

So the only thing that we modified was the y position of the square and the type of motion.

![Example Image](http://www.sohamkamani.com/blog-example__canvas-animation-framework/extras/images/square_spring.gif)

Awesome! As you can see the motion of the second square looks much more natural, gradually slowing at the edges and speeding past the center. Additionally, we did not *change* any of our source files, just added another type of motion.

Hopefully now you're all set to get animating with HTML and canvas. If you're still doubtful, heres the live [working example](http://www.sohamkamani.com/blog-example__canvas-animation-framework/) along with the complete [source code](https://github.com/sohamkamani/blog-example__canvas-animation-framework).
