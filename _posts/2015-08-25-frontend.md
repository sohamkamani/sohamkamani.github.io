---
layout: post
title:  "Understanding the modern front end web application project structure 😯"
date:   2015-08-21 18:45:12
categories: jekyll update
comments: true
---
<style type="text/css">
  h4{
    color: red;
  }
</style>
<div id="intro">
    Most people starting their journey on web development don't really pay much attention to their project structure. This is because its not really necessary, and one can easily get away by putting a bunch of html, css, and javascript files in a single folder, and linking them together. However, once you start developing more complex web applications requiring multiple frameworks and libraries, you will quickly find that this single folder structure will not cut it, and without proper organization, adding new features to your project becomes a nightmare.<br>
    <br> If you explore any popular repo on Github, you will most likely see a bunch of folders called 'lib', 'dist', 'app', 'public', 'fonts', and also a bunch of weird files like 'bower.json' and 'package.json' which don't have any apparent relation to the project itself. "Why are all these files and folders there? Why am I seeing anything other than html, css and js files?" is what I thought to myself when I was introduced to my first professional project, and a transition from a single folder to an organized structure can definitely be a bit confusing, so here is my attempt to explain as simply as possible, what each file and folder is doing in your project and what exactly is its purpose in life<br>
    <br> The directory structure shown here is the standard yeoman web project structure.
</div>
<!-- more -->
<div id="directory" style="font-family: monospace">
  YourAppName<br>
  |<br>
  --<a href="#app">app</a><br>
  |   |<br>
  |   --<a href="#indexhtml">index.html</a><br>
  |   |<br>
  |   --<a href="#favicon">favicon.ico</a><br>
  |   |<br>
  |   --<a href="#robots">robots.txt</a><br>
  |   |<br>
  |   --<a href="#scripts">scripts</a><br>
  |   |<br>
  |   --<a href="#styles">styles</a><br>
  |   |<br>
  |   --<a href="#images">images</a><br>
  |<br>
  --<a href="#dist">dist</a><br>
  |<br>
  --<a href="#test">test</a><br>
  |<br>
  --<a href="#tmp">.tmp</a><br>
  |<br>
  --<a href="#node-modules">node_modules</a><br>
  |<br>
  --<a href="#bower-components">bower_components</a><br>
  |<br>
  --<a href="#bowerjson">bower.json</a><br>
  |<br>
  --<a href="#packagejson">package.json</a><br>
  |<br>
  --<a href="#gruntfile">Gruntfile.js</a><br>
</div>

<div class="folder-article" id="app"><h4>app</h4>
this is where all you application code goes. Literally all of it. All the html, css, and javascript that you will be writing for your web application will be contained in this single folder.
<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="favicon"><h4>favicon.ico</h4>
A 'favicon' is the little picture that appears on the title bar of your website (just next to the name on the tab title bar in your browser) Although a favicon is not necessary, it helps to add a bit of professionalism to your webpage, and also gives the user a visual cue about the identity of your webpage.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="images"><h4>images</h4>
Self explanatory. All the images used for your web app go here.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="indexhtml"><h4>index.html</h4>
The starting point of your web app. this is the first page that users will see when they navigate to your webpage. Incase you are (most likely) using one of the many MVC fronted frameworks (like angular, ember, react, etc) then your index.html file will mostly be empty, only containing script tags and style tags, to load all your javascript and css for the web app. In this case, most of the markup (html) for your application will be either dynamically generated at runtime, or contained in another folder called [[views]]<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="robots"><h4>robots.txt</h4>
A file to determine what kinds of users can access your app. You can mostly ignore this file, unless you're *really* curious.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="scripts"><h4>scripts</h4>
As the name suggests, this is where all the scripts for your application go. The number of different ways you can organise your javascript files deserves an entire blog post on its own, but, in general, try to keep your javascript as modular as possible. This means that each separate script file should aim to do only one thing, and should be really good at doing that one thing only, and nothing else. For example, you should have one script file that deals with fetching data from the server, another script file for any dynamic rendering of DOM elements, another script file for any sorting functionality on your web app, another script file for any complex mathematical calculations you would want to do, etc. This is of course an over simplification and each piece of logic I just mentioned can further be broken down into separate pieces of logic.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="styles"><h4>styles</h4>
All your stylesheets go here. Each component or widget in your app should ideally have a stylesheet of its own. This helps with naming and version control(git) and is also useful for fellow developers to recognise where exactly the style for each element in your application is contained. You should be especially careful when naming css classes in your applications because that name is then applied globally. This becomes a major cause of concern as your application grows because of naming conflicts. Fortunately, there are many guidelines to solve this problem, and you should develop the habit of following these guidelines from day 1. <br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="bower-components"><h4>bower_components</h4>
This folder contains all the external libraries and frameworks that are used for your app. Bower is a tool which helps you manage external libraries and dependancies required by your app. For example, if you want to download and install jquery, all you have to do is type <code>bower install jquery</code> on your terminal, and the source files for the jquery library will be downloaded and available in this folder. This folder should not be committed to your repo.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="node-modules"><h4>node_modules</h4>
Contains all the NodeJS dependencies required by your project. Whenever you type <code>npm install</code> on your terminal, the node dependencies get installed inside this folder. This folder should not be committed to your repo because its generally really heavy in terms of space. You can just ignore this folder<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="test"><h4>test</h4>
This folder contains all the tests for your app, which include unit tests as well as end to end (e2e) test cases. Testing your applications source code is extremely important, not just because it helps you catch bugs early on, but also because it forces you to make your code modular and maintainable, and also gives you confidence that your code won't break as long as your test cases pass.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="dist"><h4>dist</h4>
As the name suggests, your distribution, or 'dist' folder is the folder which ultimately gets served to the user on production. Why do we need the dist folder? Because, serving our applications code as is in the [[.tmp]] folder is very inefficient and slow for the end user in terms of network performance. Because of this, the code in the app folder goes through a number of processes, such as [[concatenation]] and [[minification]] in order to make the network performance as fast as possible. This code is generally unreadable and is meant to be deployed once the code in the app folder is thoroughly tested. For all practical purposes, you should just leave this folder alone.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="tmp"><h4>.tmp</h4></div>
The contents of this folder is what you're actually going to view when you open your app on the browser. If all you are using is html, css and javascript, then the contents of your .tmp folder will be exactly the same as your app folder. But with the ever increasing number of build tools, templating languages, and module loading frameworks, this is rarely the case. You can mostly ignore this folder, but if you've ever made a change to the contents of your app folder and can't see them appear in the browser, you would most likely refer to this folder to check if your changes have actually been built.<br><a href="#directory">Go Back</a><br><br>

<div class="folder-article" id="gruntfile"><h4>Gruntfile.js</h4>
The grunt file is the file that describes the Grunt tasks that are going to be run. Frontend task runners is a broad topic and may require a whole [[tutorial]] on its own. In a nutshell, grunt does for you the boring repetitive tasks that would be a pain to do otherwise, like copying all your files from your app folder to your .tmp folder, compiling jade files into html files, concatenating and minifying your javascript, and even linting your code to make sure you don't make any silly errors.
Although grunt is the most popular task runner as of now, its worth mentioning that there are a lot of better and faster task runners like gulp or broccoli, so you may want to consider checking them out before you begin with grunt.<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="bowerjson"><h4>bower.json</h4>
All bower components that get installed are described in bower.json, additionally, the versioning information for each dependancy is also described. To add a bower component to bower.json you can either manually edit this file or add the dependancy directly during installation by adding a <code>--save</code> to the installation command (for example, to install jQuery, you would do <code>bower install jquery —save</code>. The latter way is recommended because there is a lesser chance of error, and also, the latest version of whatever you're trying to install will be added automatically to bower_components and bower.json<br><a href="#directory">Go Back</a><br><br></div>

<div class="folder-article" id="packagejson"><h4>package.json</h4>
Similar to [[bower.json]] except that these are you npm dependancies that go into the node_modules folder. Overtime you want to add a new node module, you should use the --save flag<br><a href="#directory">Go Back</a><br><br></div>
