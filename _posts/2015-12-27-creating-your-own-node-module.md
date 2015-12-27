---
layout: post
title:  "Creating your own node module"
date:   2015-12-21 18:45:12
categories: node
comments: true
author: Soham Kamani
---

NodeJS has a great community and one of the best package managers I have ever seen. One of the reasons npm is so great is because it encourages you to make small composable modules, which usually have just one responsibility. Many of the larger more complex node modules are built by composing smaller node modules. As of this writing, npm has over 219,897 packages. One of the reasons this community is so vibrant is because it is ridiculously easy to make your own node module. This post will go through the steps to create your own node module, as well as some of the best practices to follow while doing so.

## Prerequisites and Installation

`node` and `npm` are a given. Additionally you should also configure your npm author details :

```sh
npm set init.author.name "My Name"
npm set init.author.email "your@email.com"
npm set init.author.url "http://your-website.com"

npm adduser
```
These are the details that would show up on [npmjs.org](http://npmjs.org) once you publish.

## Hello World

The reason that I say creating a node module is ridiculously easy is because you only need two file to create the most basic version of a node module.

First up, create a package.json file inside a new folder by running the `npm init` command. This will ask you to choose a name. Of course, the name you are thinking of might already exist in the npm registry, so to check for this run the command `npm ls owner module_name` , where module_name is replaced by the namespace you want to check. If it exists, you will get information about the authors

```sh
$ npm owner ls forever
indexzero <charlie.robbins@gmail.com>
bradleymeck <bradley.meck@gmail.com>
julianduque <julianduquej@gmail.com>
jeffsu <me@jeffsu.com>
jcrugzz <jcrugzz@gmail.com>
```

If your namespace is free you would get an error message. Something similar to :

```sh
$ npm owner ls does_not_exist
npm ERR! owner ls Couldnt get owner data does_not_exist
npm ERR! Darwin 14.5.0
npm ERR! argv "node" "/usr/local/bin/npm" "owner" "ls" "does_not_exist"
npm ERR! node v0.12.4
npm ERR! npm  v2.10.1
npm ERR! code E404

npm ERR! 404 Registry returned 404 GET on https://registry.npmjs.org/does_not_exist
npm ERR! 404
npm ERR! 404 'does_not_exist' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! Please include the following file with any support request:
npm ERR!     /Users/sohamchetan/Documents/jekyll-blog/npm-debug.log
```
After setting up `package.json`, add a javascript file :

```js
module.exports = function(){
  return 'Hello World!';
}
```

And thats it! Now execute `npm publish .` and your node module will be published to npmjs.org. Also, anyone can now install your node module by running `npm install --save module_name`, where module name is the "name" property contained in package.json.

## Dependencies

As stated before, rarely will you find large scale node modules which do not depend on other smaller modules. This is because npm encourages modularity and composability. To add dependancies to your own module, simply install them. For example, one of the most depended upon packages is lodash, a utility library. To add this, run the command :

```sh
npm install --save lodash
```

Now you can use lodash everywhere in your module by "requiring" it, and when someone else downloads your module, they get lodash bundled along with it as well.

Additionally you would want to have some modules purely for development and not for distribution. These are dev-dependencies, and can be installed with the `npm install --save-dev` command. Dev dependencies will not install when someone else installs your node module.

## Configuring package.json

The `package.json` file is what contains *all* the metadata for your node_module. A few fields are filled out automatically (like dependencies or devDependencies during npm installs). There are a few more fields in package.json that you should consider filling out so that your node module is best fitted to its purpose.

- **"main"** : The relative path of the entry point of your module. Whatever is assigned to module.exports in this file is exported when someone "requires" your module. By default this is the `index.js` file.
- **"keywords"** : Its an array of keywords describing your module. Quite helpful when others from the community are searching for something that your module happens to solve.
- **"license"** : I normally publish all my packages with an "MIT" licence because of its openness and popularity in the open source community.
- **"version"** : This is pretty crucial because you cannot publish a node module with the same version twice. Normally, [semver](http://semver.org/) versioning should be followed.

If you want to know more about the different properties you can set in package.json theres a great [interactive guide](http://browsenpm.org/package.json) you can check out.

## Using yeoman generators

Although it's really simple to make a basic node module, it can be quite a task to make something substantial using just and `index.js` nd `package.json` file. In these cases, there's a lot more to do like :

- Writing and running tests
- Setting up a CI tool like [Travis](https://travis-ci.org/)
- Measuring code coverage.
- Installing standard dev dependencies for testing.

Fortunately, there are many Yeoman generators to help you bootstrap your project. Check out [generator-nm](https://github.com/sindresorhus/generator-nm) for setting up a basic project structure for a simple node module. If writing in ES6 is more your style, you can take a look at [generator-nm-es6](https://github.com/sohamkamani/generator-nm-es6). These generators get your project structure, complete with a testing framework and CI integration so that you don't have to spend all your time writing boilerplate code.

## Publish
