---
layout: post
title: Creating a MongoDB replica set using Docker 🍃
date: 2016-06-30T00:45:12.000Z
categories: snapchat tech
comments: true
---

Replication is a technique used my MongoDB to ensure that your data is always backed up for safe keeping, in case one of your database servers decide to crash, shut down or turn into Ultron. Even though replication as a concept sounds easy, it's quite daunting for newcomers to set up their own replica sets, much less containerize them.  
This tutorial is a beginner friendly way to set up your own MongoDB replica sets using docker.

## Pre-requisites

The only thing we need installed on our machines is [Docker](https://www.docker.com/products/overview), and.... that's it! We don't even need to install MongoDB to create our replica set, since we can access the shell through our containers itself.

To verify that you have docker installed run :

```sh
docker -v
```

 ,which should output the version number. Next, we need to make sure our docker daemon is running. So run :

```sh
docker images
```

,which should output the list of images you currently have on your system.  
Next, we will get the latest version of the [official Mongo image](https://hub.docker.com/_/mongo/), by running

```sh
docker pull mongo
```

Great! Now were all set to get up and running.

## Overview

We are going to have 3 containers from the mongo image, all inside their own [docker container network](https://docs.docker.com/engine/userguide/networking/dockernetworks/). Let's name them `mongo1`, `mongo2`, and `mongo3`.
These will be the three mongo instances of our replica set. We are also going to expose each of them to our local machine, so that we can access any of them using the mongo shell interface from our local machine if we need to (you will have to install MongoDB on your own machine to do this). Each of the three mongo container should be able to communicate with all other containers in the network.

![architecture diagram](/assets/images/posts/docker-mongo-replication/architecture-diagram.png)

## Setting up the network and containers

To see all networks currently on your system, run the command

```
$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
2a4e341c6039        bridge              bridge              local
4fbef5286425        host                host                local
8062e4e7cdca        none                null                local
```

We will be adding a new network called `my-mongo-cluster` :

```sh
$ docker network create my-mongo-cluster
```

The new network should now be added to your list of networks :

```txt
$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
2a4e341c6039        bridge              bridge              local
4fbef5286425        host                host                local
f65e93c94e42        mongo-cluster       bridge              local
8062e4e7cdca        none                null                local
```
