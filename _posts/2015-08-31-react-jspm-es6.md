---
layout: post
title:  "Supercharge your ReactJs application with ES6 and jspm"
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
 
Although jspm and ES6 can be used for any type of application, I have specifically targeted React because I feel that the intentions of ES6's module loading specification and ReactJs are all focussed on the same thing, and that is componentization -- separating your logic into small byte sized pieces. Throwing a mountain of script tags in your index.html file for a single page application is just not as appealing as it used to be. The ES6 way of doing things is to only import a piece of functionality when you need it. This marries really well with Reacts principle of separating your markup into its induvidual components, so its only natural that both of them be used together. Don't worry... if you've never heard of jspm before, it's really friendly to new-comers :)

I'm not going to go into the details of what jspm is because it's explained really well on their website, so lets just dive into bootstrapping our hello world application.

<ol>
<li> Install jspm, if you haven't already:<br/>
   <code>npm install -g jspm</code>
</li> 
 
<li> 
Make a new directory, and initialize a new jspm project:  <br/>
  <code>jspm init</code>  <br/>
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