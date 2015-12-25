---
layout: post
title:  "Automating NodeJS application deployment using capistrano and pm2"
date:   2015-12-21 18:45:12
categories: node deployment pm2 capistrano
comments: true
author: Soham Kamani
---

Writing a backend API service in NodeJS can be quite a task, and even though everything would be working fine and dandy in your local system, getting that same codebase up and running in an actual production server can be quite a task. Roughly put, here are the steps you have to follow to deploy a node application onto a new server :

1. Copy the codebase.
2. Install dependencies (in our case node modules, both local and global)
3. Run tests
4. Start the server, using a process manager or load balancer.

Doing these tasks manually on your own (maybe through an ssh'ing into the server) is possible, but the thing is, *all* these tasks have to be performed on *each* deployment. It's just begging for automation! But how? Application deployment means you have to deal with doing things on *another* machine. Task runners and scripts you normally use on your own machine will almost certainly not work on a remote server due to a difference in operating system or environment variables. Luckily, theres a tool out there which specializes in doing exactly this, called [capistrano](http://capistranorb.com/#).

Using powerful tools like capistrano, [pm2](https://github.com/Unitech/pm2), and [npm](https://www.npmjs.com/), we can make this happen.

## Prerequisites and Project Structure

First up, lets talk about how all our files are going to be structured.

```text
.
├── .gitignore
├── Capfile
├── app.js
├── config
│   ├── deploy
│   │   ├── my_server.rb
│   │   ├── production.rb
│   │   └── staging.rb
│   └── deploy.rb
├── package.json
└── test.js
```
Make sure you have [capistrano](http://capistranorb.com/#), [pm2](https://github.com/Unitech/pm2), and [npm](https://www.npmjs.com/) installed. You can generate your own package.json by running the command ```npm init``` and you can generate the Capfile, along with a few useful others by running ```cap install```.
You can find the complete code here.
Lets take a look at the important files in detail.

### app.js

```js
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```
This is just a simple [hello world example](http://expressjs.com/en/starter/hello-world.html) for express.

### test.js

```js
var assert = require('assert');

describe('My application', function () {

  it('Passes all the tests', function () {
    assert.equal('Hello', 'Hello');
    assert.equal('World', 'World');
  });

});
```
A simple hello world mock test. We have to make sure these tests pass on the deployment server as well. We use [mocha](https://mochajs.org/) in this example for testing, but you can use whatever testing framework you want.

### package.json

```js
{
  "name": "my_service",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "pm2:start": "pm2 start app.js --name $APP_NAME -l app_logs.log",
    "pm2:restart": "pm2 stop $APP_NAME && pm2 delete $APP_NAME && npm run pm2:start",
    "pm2": "if pm2 list | grep $APP_NAME; then npm run pm2:restart; else npm run pm2:start; fi",
    "debug": "node debug app.js",
    "start": "node app.js",
    "test": "mocha test.js"
  },
  "author": "john foobar",
  "license": "ISC",
  "devDependencies": {
    "assert": "^1.3.0",
    "mocha": "^2.3.4",
    "pm2": "^0.15.10"
  },
  "dependencies": {
    "express": "^4.13.3"
  }
}
```

npm and package.json are central to deploying our application, because it is package.json which contains all our start up scripts. The reason we use npm scripts and not separate shell script files is because npm exposes all the binaries shipped by our node modules in the scripts defined in package.json. This means that even though we do not have pm2 or mocha installed globally on our server (which in many times is the case), we can still use all their CLI tools locally. This also save us from all the trouble we would have with using the correct versions of our tools.

Lets go through our ```pm2``` scripts in detail :
- ```pm2``` : Checks if there are any pm2 processes running with our app name. If so, it then restarts our app (by running ```npm run pm2:restart```), if not, it starts our app (by running ```npm run pm2:start```).
-  ```pm2:restart``` : Stops and removes our running app process, and then starts it again using ```npm run pm2:start```
- ```pm2:start``` : starts our application (whose main file is app.js) , and assigns a name to it, along with sending all logs from the application to app_logs.log (located in the project directory)

### deploy.rb

```ruby
lock "3.4.0"

set :application, "my_app"
set :branch, "master"
set :user, "john"
set :repo_url, "http://github.com/john/myapp.git"
set :deploy_to, "/srv/#{fetch :application}"
set :linked_dirs, %w(node_modules)

namespace :deploy do
  desc "Install node modules"
  after :updated, :install_node_modules do
    on roles(:app) do
      within release_path do
        execute :npm, "install", "-s"
      end
    end
  end

  desc "Run Tests"
  after :finished, :test do
    on roles(:app) do
      within release_path do
        execute :npm, "test"
      end
    end
  end

  desc "Start server"
  after :finished, :restart do
    on roles(:app) do
      within release_path do
        execute "echo Restarting your service now."
        execute "cd #{release_path} && APP_NAME=\"#{fetch :application}\" npm run pm2"
        execute "echo Deployer Successfully deployed this Application"
      end
    end
  end
end
```

Here we see three tasks performed on deployment :  

1. **Install node modules** : Quite obviously, this installs our node modules. But the important thing to remember is to add ```node_modules``` as a linked directory, otherwise your node modules will be installed in different folders each time you deploy, which is definitely not good in the long run.  
2. **Run Tests** : Runs tests, through the ```npm test``` command.  
3. **Restart Server** : This executes the ```npm run pm2``` command we discussed previously, but before that, it sets the ```APP_NAME```   variable as the name of our application (in this case "my_app"). This value is then used through the whole chain of npm commands (which is where $APP_NAME appears).  

### my_server.rb

```ruby
server 'my_remote.server.com', user: fetch(:user), roles: %w{web app}
```
This file exists solely to provide options which are unique only to your particular server. In this case our server name (obviously) is unique to our server. This is so that if you want to deploy to another server, you need only to create another file, which has a different server name, or maybe override some of the options.

## Deploy!!

Once you have all your files configured, all that's left is to run the command ```cap sandbox deploy```.

This will :
- Start an ssh session with ```my_remote.server.com```, with the user "john", after prompting you for the password.
- Copy the source code into the current directory present in the ```/srv/my_app``` directory of your server.
- Install node_modules.
- Run tests using mocha.
- Start the server using pm2.

By convention, when you run ```cap foobar deploy``` , capstrano runs the tasks defined in the deploy namespace in deploy.rb, against the settings defined in config/deploy/foobar.rb. This means that if you want to deploy to another server (say, your staging or production server), all you have to do is add staging.rb and production.rb to your config/deply folder, then run ```cap staging deploy``` or ```cap production deploy```. Its as easy as that.
