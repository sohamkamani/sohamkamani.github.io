---
layout: post
title:  "Supercharge your ReactJs application with ES6 and jspm ⚡"
date:   2015-08-31 18:45:12
categories: reactjs jspm es6
comments: true
author: Soham Kamani
---
<style>
  ol > li {
    margin-bottom: 15px;
  }  
</style>
This post is about creating a hello world application using jspm and ES6 with ReactJs.

Feeling lazy and just want to see the code? [Go Here](http://github.com/sohamkamani/jspm-es6-react-bootstrap/)

Although jspm and ES6 can be used for any type of application, I have specifically targeted [React](http://facebook.github.io/react/) because I feel that the intentions of ES6's module loading specification and ReactJs are all focused on the same thing, and that is componentization -- separating your logic into small byte sized pieces. Throwing a mountain of script tags in your index.html file for a single page application is just not as appealing as it used to be. The ES6 way of doing things is to only import a piece of functionality when you need it. This marries really well with Reacts principle of separating your markup into its individual components, so its only natural that both of them be used together. Don't worry... if you've never heard of jspm before, it's really friendly to new-comers :)<!-- more -->
I'm not going to go into the details of what jspm is because it's explained really well on [their website](http://jspm.io/), so lets just dive into bootstrapping our hello world application.

<ol>
<li> Install jspm, if you haven't already:<br/>
   <code>npm install -g jspm</code>
</li>

<li>
Make a new directory, and initialize a new jspm project:  <br/>
  <code>jspm init</code>  <br/>
  And install all the dependencies we will require:<br>  
  <code>jspm install react react-dom jsx</code><br>
  After all the initialization formalities are done, your folder tree will look something like this:  <br/>
  .  <br/>
  ├── config.js  <br/>
  ├── jspm_packages  <br/>
  │   ├── es6-module-loader.js  <br/>
  │   ├── es6-module-loader.js.map  <br/>
  │   ├── es6-module-loader.src.js  <br/>
  │   ├── github  <br/>
  │   ├── npm  <br/>
  │   ├── system.js  <br/>
  │   ├── system.js.map  <br/>
  │   └── system.src.js  <br/>
  └── package.json
</li>

<li> Now to write out index.html file, which will be put into the root of the project.
{% highlight html %}
<!--index.html-->
<html>

<head>
    <title>JSPM Experiment</title>
</head>

<body>
    <div id="container"></div>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
        System.import('./start');
    </script>
</body>

</html>
{% endhighlight %}
   <em>What? Is that it?</em>
   Yep, thats it. And most likely, for most of your projects, that would be the only content that will ever be in your index.html file.
</li>
<li>
  Next, lets create the start.js file that your index.html keeps raving about. This file will not have any functional code in it and simply serves       as an entry point to the rest of the app. For this project, it will be exactly 1 line :

{% highlight javascript %}
//start.js
import './lib/react_render';
{% endhighlight %}
</li>
<li>
  All of your js files will be in the src directory. Here, react_render.js is the script that finally renders all your react components.
{% highlight javascript %}
//lib/react-render.jsx
import OuterComponent from './react_components/outer-component.jsx!';
import ReactDom from 'react-dom';
import React from 'react';


ReactDom.render(
  React.createElement(OuterComponent)
  , document.getElementById('event-box'));
{% endhighlight %}
The '!' after the jsx file means that we don't want to append a '.js' extension to it. JSX files are handled nicely by babel, which comes shipped out of the box with jspm.
</li>
<li>
  In the previous step, we are importing and outer component into our 'react-render.jsx' file, so lets set that up:
{% highlight javascript %}
//lib/react_components/outer-component.jsx
import React from 'react';

import InnerComponent from './inner-component.jsx!'

var OuterComponent = React.createClass({
  render: function () {
    return (
      <div>
        <h1>I am the outer title</h1>
        <InnerComponent />
        <InnerComponent />
        <InnerComponent />
      </div>
    );
  }
});

export default OuterComponent;
{% endhighlight %}  
</li>
<li>
  Finally lets create the 'InnerComponent' used by the 'OuterComponent'
{% highlight javascript %}
//lib/react_components/inner-component.jsx
import React from 'react';

var InnerComponent = React.createClass({
  render: function () {
    return (
      <div>
      Hi! Im the inner component.
      </div>
    );
  }
});

export default InnerComponent;
{% endhighlight %}
</li>

And... thats it! Run a local server on the root directory of the project and open up the index.html file, and you should see something like this: <br>
<img src="/assets/images/posts/react-es6-jspm/img1.png"><br>  
As you may have noticed, most of our scripts are pretty small, barely exceeding 20 lines of code. This is because each piece of logic (in this case each react component) is contained in its own file. And, as a bonus, we get all the awesome new features of ES6 to play around with.
<br>
If you got lost at any point, here's the <a href="http://github.com/sohamkamani/jspm-es6-react-bootstrap/">source</a> for the entire project.
