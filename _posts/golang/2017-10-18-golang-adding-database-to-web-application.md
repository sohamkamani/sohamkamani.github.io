---
layout: post
title: Adding a postgres database to a Go web application
date: 2017-10-18T01:45:12.000Z
categories: go golang web postgres sql
description: "A tutorial on integrating a database into your Go web application"
comments: true
---

This post will go through how to add a postgres database into your Go application.

It is not enough to just add a driver and qury the database in your code if you want to make you application production ready. There are a few things that you have to take care of:

1. How would you write tests for you application?
2. 