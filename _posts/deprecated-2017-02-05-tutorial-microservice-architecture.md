---
layout: post
title:  Make your own microservice architecture with docker
date:   2017-02-05 01:45:12
categories: micro service docker architecture
comments: true
---

There has been a lot of buzz about microservices lately. An increasing number of startups and enterprises have started to adopt this architecture style, but for some reason the term "microservices" carried along with it a lot of mystery for new-comers when it comes to actual implementation. 

When you bring docker into the mix (which itself comes with a lot of buzzwords and mysteries), you get a combination that most people tend to shy away from because of the apparent complexity involved.

I made this article so that newcomers can rest easy knowing that microservices and docker are not as complicated as they think. So, lets get to it:

## Prerequisites

Before jumping into implementing microservices using docker, it is recommended that you have a base level knowledge on how to make a web server (in any language), and a little bit of knowledge on docker. If not, theres a great tutorial [here](https://prakhar.me/docker-curriculum/).

## The calculator as a service

Before we get into the details, lets find something to build : a calculator as a service.

To the outside world, we are going to expose 2 APIs, to add and subtract numbers.

With our server up and running, if our users hit `/add/2/3` on our url, they would get a response of "5". Similarly, if they hit `/subtract/2/3` , they would get a response of "-1".

## Microservices

If were to build a traditional monolithic application, we would have both these APIs built into one running server using the language of our choice (java, node, python and the like)

![monolith](/assets/images/posts/microservice-docker/microservice-monolith.svg)

While this may be the best approach for building smaller applications, it comes with some baggage as your application starts to grow and scale

## Docker 

## Deploying our calculator