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

First up, create a package.json file by running the `npm init` command. This will ask you to choose a name. Of course, the name you are thinking of might already exist in the npm registry, so to check for this run the command `npm ls owner module_name` , where module_name is replaced by the namespace you want to check. If it exists, you will get information about the authors

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

## Dependencies

## Configuring package.json

## Modularizing

## Using yeoman generators

## Publish
