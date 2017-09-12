---
layout: post
title: "Simulating realistic random motion : The different degrees of randomness 🎲"
date: 2017-09-10T01:45:12.000Z
categories: math random
comments: true
---

<style>
        .ch-container {
            display: flex;
            width: 100%;
            margin-bottom: 10px;
        }

        .ch-container > button {
            margin: auto;
            font-size: 1em;
        }

        .charts {
            width: 70%;
            margin: auto;
            display: flex;
            flex-direction: column;
        }

        .charts>canvas {
            width: 90%;
            height: 200px;
            margin: auto;
        }

        .charts > p {
          margin: auto;
          font-family: sans-serif;
        }

        .fly>canvas {
            width: 100%;
            height: 100%;
        }

        .fly {
            border: 1px solid grey;
            width: 25%;
            margin: auto;
        }

        .sample-chart{
            width: 90%;
            margin: auto;
            border: 1px solid grey;            
        }

        .regen-sample{
            background-color: rgb(0, 147, 249);
            color: white;
            cursor: pointer;
            padding: 3px;
            border-radius: 4px;
            box-shadow: 0px 3px 7px 0px #888888;
        }
    </style>

Random sequences are a bunch of random numbers arranged one after the other.

Something like this : <span id="random-sequence">4, 6, 10, -6, -2, 1</span>

Seems straightforward right? But, what if we wanted to bring some order to these sequences, while still retaining their randomness?

<!-- more -->

To get a sense of what this means, take a look at these charts :

<canvas class="sample-chart" width="1000" height="200" id="sample0"></canvas>
<canvas class="sample-chart" width="1000" height="200" id="sample1"></canvas>
<canvas class="sample-chart" width="1000" height="200" id="sample2"></canvas>

Each chart is a plotted random sequence: The value of the number represented on the Y axis, and the position of the number of the sequence on the X axis.

(You can even <span class="regen-sample" id="c-regen-sample">REGENERATE</span> them)

Even though each chart is random (in the sense that the next value cannot be guessed from any of the other values), the second chart seems much _less random_ than the first, and the third much less than the second.

How are these sequences created and what can they be used for?

## Derivatives of random sequences

### Random position

<canvas class="sample-chart" width="1000" height="200" id="sample0c"></canvas>

The first chart looks like an absolute mess. Almost like those static radio signals you see in movies. This chart is made from a _truly_ random sequence. This means that each value in the sequence is selected randomly, and independently. To generate this type of sequence, just roll some dice and note down the sequence of values that appear.

Let's call this type of sequence a _random position_ sequence (you'll understand why in a bit).

### Random velocity

The second chart looks a bit jagged, but much more ordered than the first one. In fact, it actually looks a lot like a chart of stock prices throughout the week

<canvas class="sample-chart" width="1000" height="200" id="sample1c"></canvas>

We'll name this type of sequence a _random velocity_ sequence. The method to generate this sequence is surprisingly simple : The value of each point in a "random velocity" type sequence is the sum of all previous points of a "random position" type sequence. So, if you have a random position sequence of :

```
[ 2, -1, 3, 9, -4, 3, 1 ]
```

- The first number in our random velocity sequence would be `2` (since it's the first element).
- The second number would be `2 + (-1)`, which is `1`
- The third number would be `2 + (-1) + 3`, which is `4`
- ...and so on

In the end we would get a random velocity sequence of :

```
[ 2, 1, 4, 13, 9, 12, 13 ]
```

### Random force

The last chart looks much smoother than the other two, although with a few slopes here and there. Appearance wise, this looks similar to the slope of a hill or mountain.

<canvas class="sample-chart" width="1000" height="200" id="sample2c"></canvas>

To generate this type of a sequence, we perform the same action of summation, but this time on a random velocity sequence. Looking at the random velocity sequence in the last section, the new sequence we would get after summation would be :

```
[ 2, 3, 7, 20, 29, 41, 54 ]
```

We will call this type of sequence a "random force" type sequence.

## Random sequences in real life

There's a reason we named the above sequences as random force, velocity, and distance. To understand this better, we need to take a little deviation into physics and calculus.

If we have a time series function for the velocity of any object, we can find its position time series function by integrating the velocity function over time. It's ok if you don't know what this is, but what you _should_ know, is that the discrete time equivalent of integration is summation. The _exact same_ summation that was performed to obtain the "random velocity" and "random force" type sequences.

Similarly, the acceleration (which is proportional to __force__, for an object with a given mass) discrete time series is found by summation of its velocity sequence.

Now, the reason for these names should be more clear:

- The "random position" sequence describes the position of an object with respect to time, when its _position_ is random.
- The "random velocity" sequence describes the position of an object with respect to time, when its _velocity_ is random.
- The "random force" sequence describes the position of an object with respect to time, when its _acceleration_ (or force for constant mass) is random.

Let's attach these concepts to something relatable to really understand them...

### Visualizing two-dimensional movement

We will now attempt to visualize the movement of an ant (or any other insect of your choice) in two dimensions. To do this, we first generate a "position × time" graph. This is generated for all 3 types of random sequences (position, velocity, and acceleration). The first graph is for the __x coordinate__ of the ant, and the second graph is for the __y coordinate__ of the ant.

First, lets start with random position :



<div class="ch-container"> 
        <button class="regen-sample" id="d0regen">Click to regenerate</button>
</div>
<div class="ch-container">
    <div class="charts">
        <p>X-axis</p>
        <canvas id="d0x" height="300" width="900"></canvas>
        <p>Y-axis</p>        
        <canvas id="d0y" height="300" width="900"></canvas>
    </div>
    <div class="fly">
        <canvas id="d0f" width="200" height="200"></canvas>
    </div>
</div>

This is nuts! It's quite obvious that this does not look like how an ant would move around in real life (because ants cannot teleport). Let's move on and model its movement with a random velocity type sequence :

<div class="ch-container"> 
        <button class="regen-sample" id="d1regen">Click to regenerate</button>
</div>
<div class="ch-container">
    <div class="charts">
        <p>X-axis</p>
        <canvas id="d1x" height="300" width="900"></canvas>
        <p>Y-axis</p>        
        <canvas id="d1y" height="300" width="900"></canvas>
    </div>
    <div class="fly">
        <canvas id="d1f" width="200" height="200"></canvas>
    </div>
</div>

This seems a _little_ more realistic than the motion described by random position, but our ant is quite jittery, and its motion makes it look like its shivering.

Things do get better when we plot the motion described by coordinates generated by a random acceleration sequence :

<div class="ch-container"> 
        <button class="regen-sample" id="d2regen">Click to regenerate</button>
</div>
<div class="ch-container">
    <div class="charts">
        <p>X-axis</p>
        <canvas id="d2x" height="300" width="900"></canvas>
        <p>Y-axis</p>        
        <canvas id="d2y" height="300" width="900"></canvas>
    </div>
    <div class="fly">
        <canvas id="d2f" width="200" height="200"></canvas>
    </div>
</div>

Now, things start to look more realistic. The motion is smooth, and represents actual movement, even though the movement we are seeing is completely derived from random values.

### Why though?

It's not a coincidence that the random force sequence more accurately depicts real movement. If you think about the real world, there is almost no object whose position is "random". Rather, its position is affected by its _velocity_ at any point in time, and its _velocity_ is affected by the forces acting on it.

So, when you want to give something random motion, you don't simply randomize its position. You randomize the thing that _changes_ its position, by randomizing the thing that _changes its change_ in position.

This can also be applied to almost any dynamic quantity, like stock prices or electricity, and can be extended in multiple dimensions (just like how two dimensional motion was simulated) to simulate multidimensional quantities (say, if we wanted to add a third dimension + direction orientation) to our existing simulation.

_The source code for the chart generation and animation can be found [here](https://github.com/sohamkamani/blog-example__random-motion-generator)_

<script src="/assets/scripts/randomness.bundle.js"></script>
<script>
  const randomSequence = [0,0,0,0,0,0,0,0,0,0].map(()=> Math.floor(Math.random() * 100))
  document.getElementById('random-sequence').innerHTML = randomSequence
</script>
<script>
var hitButton = function(eName) {
  return function() {
    window.ga &&
      ga('send', {
        hitType: 'event',
        eventCategory: 'Buttons',
        eventAction: 'click',
        eventLabel: eName
      })
  }
}

document.getElementById('d0regen').addEventListener('click', hitButton('d0regen'))
document.getElementById('d1regen').addEventListener('click', hitButton('d1regen'))
document.getElementById('d2regen').addEventListener('click', hitButton('d2regen'))
document.getElementById('c-regen-sample').addEventListener('click', hitButton('c-regen-sample'))

</script>