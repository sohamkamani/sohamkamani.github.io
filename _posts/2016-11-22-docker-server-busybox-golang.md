---
layout : post
title : Building a (very) lightweight web server in docker with busybox and Go 🐻
date: 2016-11-22T08:45:12.000Z
categories: docker go busybox golang
comments: true
---

One of the things that has always irked me about docker was the size of its images. To give you an example, take a look at my current set of images :

```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
golang              onbuild             c2ce4aa3b0ae        13 days ago         672.4 MB
nginx               latest              4efb2fcdb1ab        3 months ago        183.4 MB
mongo               latest              282fd552add6        5 months ago        336.1 MB
node                6.2.2               9121f2a78909        5 months ago        659.4 MB
node                latest              9121f2a78909        5 months ago        659.4 MB
hello-world         latest              693bce725149        5 months ago        967 B
ubuntu              latest              2fa927b5cdd3        5 months ago        122 MB
mysql               5.5                 2f94d2a2ac89        6 months ago        255.9 MB
busybox             latest              47bcc53f74dc        8 months ago        1.113 MB
```

This is nuts! Most of the base images are upwards of 100MB in size, with many being as large as 600MB! This is aggravated by the fact that any image built on top of these images takes even more space.

While this is ok with modern systems with many gigabytes of RAM and near unlimited storage space, there might be a crunch if you want to deploy a container on a smaller device (think raspberry pi).

This post will take you through how to build a fully functioning web server and have the resulting image have a size of lesser than 10MB.

<!-- more -->

## The base image

If you observed the list of images, theres one that stands out because of its miniscule size : [busybox](https://hub.docker.com/_/busybox/)

Busybox is a tiny linux image, meant for space efficient distributions. This comes at a cost. You will find that most of the shell utilities you are familiar with are not present in busybox, in order to maintain its tiny size.

If you want to explore the shell yourself, run this command :

```sh
docker run -it --rm busybox
```

This leaves us with the only option of executing binaries directly on it.

Fortunately for us, this is exactly what Go gives us the power to do.

## Writing our web server

For the purposes of demonstration, let's write a very basic web server. Create a new file called `server.go` :

```golang
package main

import (
	"fmt"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello %s!", r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("Server running...")
	http.ListenAndServe(":8080", nil)
}
```

Try running this yourself by running :

```sh
go run server.go
```

and going to [localhost:8080/world](http://localhost:8080/world) on your browser.

All good? Next, we have to build the binary which will sit on top of busybox. In order to do this, you will have to specify some additional settings to build the binary for busybox, since the machine you are sitting on probably doesn't have the same OS or architecture. We do this with the `GOOS` and `GOARCH` environment variables.

```sh
GOOS=linux GOARCH=386 go build ./server.go
```

This will give you an executable file called `server`

## Building our docker image

Create a `Dockerfile` in the same directory as the `server` executable :

```sh
FROM busybox
COPY ./server /home/
CMD /home/server
```

And then run :

```sh
docker build -t go-server .
```

This will create a new `go-server` image.

## Running the image

Verify that your image has been created by running :

```sh
docker images | grep "go-server"
```

Create and run new container from your image by running :

```sh
docker run -p 8080:8080 --rm -it go-server
```

...and thats it! You have now made an ultra small docker image to run a web server... and all that in less than 6MB!

If you liked this post, you may also like my other post on [creating a MongoDB replica set using Docker](/blog/2016/06/30/docker-mongo-replica-set/)
