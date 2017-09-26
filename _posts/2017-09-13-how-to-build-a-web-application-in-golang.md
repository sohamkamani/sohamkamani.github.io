---
layout: post
title: Build a web application in Go (golang)
date: 2017-09-13T01:45:12.000Z
categories: go golang web
description: "An end to end tutorial on how to build a full stack web application in golang"
comments: true
---

Go is getting more and more popular as the go-to language to build web applications. 

This is in no small part due to its speed and application performance, as well as its portability. There are many resources on the internet to teach you how to build end to end web applications in Go, but for the most part they are either scattered in the form of isolated blog posts, or get into too much detail in the form of books.

With this tutorial, I hope to find the middle ground and provide a single resource which describes how to make a full stack web application in Go, along with sufficient test cases.

The only prerequisite for this tutorial is a beginner level understanding of the Go programming language, and a tiny bit of knowledge about SQL (which you can find in a 15 minute read [here](/blog/2016/07/07/a-beginners-guide-to-sql/)).

<!-- more -->

## "Full Stack" ?

We are going to build a community encyclopedia of birds. This website will :

- Display the different entries submitted by the community, with details and an image of the bird they found.
- Allow anyone to post a new entry about a bird that they saw.

This application will require three components :

1. The web server
2. The front-end (client side) app
3. The database

![Image showing application architecture](/assets/images/posts/golang-web-application/blog-golang-web-app-arch.svg)

### Contents

## Setting up your environment

>This section describes how to set up your environment and project structure for the first time. If you have built another project in go, or know the standard directory structure, you can skip this section and go to the [next one](/)

### 1. Set up your $GOPATH

Run this command to check the current value of your `$GOPATH` environment variable :

```sh
echo $GOPATH
```

If you do not see a directory name, add the `GOPATH` variable to your environment (you can select any directory location you want, but it would be better if you create a new directory for this) :

```sh
export GOPATH="/location/of/your/gopath/directory"
```

You can paste the above line in you `.bashrc` or `.zshrc` file, in case you wish to make the variable permanent.

### 2. Set up your directory structure

Hereafter, the "Go directory" will refer to the location described by your `$GOPATH` environment variable. Inside the Go directory, you will have to create 3 folders (if they are not there already) :

```sh
# Inside the Go directory
mkdir src
mkdir pkg
mkdir bin
```

The purpose of each directory can be seen from its name:

- `bin` - is where all the executable binaries created by compiling your code go
- `pkg` - Contains package objects made by libraries (which you don't have to worry about now)
- `src` - is where __all__ your Go source code goes. Yes, all of it. Even that weird side project that you are thinking of making.

### 3. Creating your project directory

The project folders inside the `src` directory should follow that same location structure as the place where your remote repository lies.
So, for example, if I want to make a new project called "birdpedia", and I make a repository for that under my name on github, such that the location of my project repository would be on "github.com/sohamkamani/birdpedia", then the location of this project on my computer would be : `$GOPATH/src/github.com/sohamkamani/birdpedia`

Go ahead and make a similar directory for your project. If you haven't made an online repo yet, just name the directories according to the location that you _plan_ to put your code in.

This location on your computer will henceforth be referred to as your "project directory"

## Starting an HTTP server

Inside your project directory, create a file called `main.go` inside your project directory :

```sh
touch main.go
```

This file will contain the code to start your server :

```go
// This is the name of our package
// Everything with this package name can see everything
// else inside the same package, regardless of the file they are in
package main

// These are the libraries we are going to use
// Both "fmt" and "net" are part of the Go standard library
import (
	// "fmt" has methods for formatted I/O operations (like printing to the console)
	"fmt"
	// The "net/http" library has methods to implement HTTP clients and servers
	"net/http"
)

func main() {
	// The "HandleFunc" method accepts a path and a function as arguments
	// (Yes, we can pass functions as arguments, and even trat them like variables in Go)
	// However, the handler function has to have the appropriate signature (as described by the "handler" function below)
	http.HandleFunc("/", handler)

	// After defining our server, we finally "listen and serve" on port 8080
	// The second argument is the handler, which we will come to later on, but for now it is left as nil,
	// and the handler defined above (in "HandleFunc") is used
	http.ListenAndServe(":8080", nil)
}

// "handler" is our handler function. It has to follow the function signature of a ResponseWriter and Request type
// as the arguments.
func handler(w http.ResponseWriter, r *http.Request) {
	// For this case, we will always pipe "Hello World" into the response writer
	fmt.Fprintf(w, "Hello World!")
}
```

>`fmt.Fprintf`, unlike the other "printf" statements you may know, takes a "writer" as its first argument. The second argument is the data that is piped into this writer. The output therefore appears according to where the writer moves it. In our case the ResponseWriter `w` writes the output as the response to the users request.

You can now run this file :

```sh
go run main.go
```

And navigate to [http://localhost:8080](http://localhost:8080) in your browser, or by running the command :

```sh
curl localhost:8080
```

And see the output: "Hello World!"

You have now successfully started an HTTP server in Go.

## Making routes

### Testing

## Serving static files

### Building a simple to-do list

## Connecting to a database

### Testing

## Putting it all together

### Integration tests

## Further reading
