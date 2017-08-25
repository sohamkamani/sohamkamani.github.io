---
layout: post
title: Golang Channels - a tutorial on using channels in Go ➡️
date: 2017-08-24T01:45:12.000Z
categories: go golang channel
description: "An introduction on channels in Go, and how to visualize them"
comments: true
---

If you're a beginner getting into Go, its mostly quite easy and straightforward. That is, until you get to channels.

At first, everything about channels seems confusing and unintuitive. The fact that not many other popular programming languages have a similar concept, means that channels is one concept that you _have_ to spend some time learning them, if you're starting your journey with Go.

At the end of this article, you should have all you need to understand how channels work in Go.

## Visualizing Goroutines

To understand channels properly, it is essential to know how to visualize Goroutines first.

Let's start with a simple Goroutine, that takes a number, multiplies it by two, and prints its value:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	n := 3

	// We want to run a goroutine to multiply n by 2
	go multiplyByTwo(n)

	// We pause the program so that the `multiplyByTwo` goroutine
	// can finish and print the output before the code exits
	time.Sleep(time.Second)
}

func multiplyByTwo(num int) int {
	result := num * 2
	fmt.Println(result)
	return result
}
```

We can visualize this program as a set of two blocks: one being the main funciton, and the other being the multiplyByTwo goroutine.

![go routines as blocks](/assets/images/posts/go-channels/goroutines-1.svg)

The problems with this implementation (that can also be seen from the diagram), is that these two parts of our code are rather disconnected. As a consequence :

- We cannot access the result of `multiplyByTwo` in the `main` function.
- We have no way to know when the `multiplyByTwo` goroutine completes. As a result of this, we have to pause the `main` function by calling `time.Sleep`, which is a hacky solution at best.

## Example #1 - Adding a channel to our goroutine 

Let's now look at some code that introduces how to make and use a channel in Go :

```go
package main

import (
	"fmt"
)

func main() {
	n := 3

	// This is where we "make" the channel, which can be used
	// to move the `int` datatype
	out := make(chan int)

	// We still run this function as a goroutine, but this time,
	// the channel that we made is also provided
	go multiplyByTwo(n, out)

	// Once any output is received on this channel, print it to the console and proceed
	fmt.Println(<-out)
}

// This function now accepts a channel as its second argument...
func multiplyByTwo(num int, out chan<- int) {
	result := num * 2

	//... and pipes the result into it
	out <- result
}
```

A channel gives us a way to "connect" the different concurrent parts of our program. In this case, we can represent this connection between our two concurrent blocks of code visually :

![go routines as blocks with channel](/assets/images/posts/go-channels/goroutines-2.svg)

Channels can be thought of as "pipes" or "arteries" that connect the different concrrent parts of our code. 

### Directionality

You can also observe that the connection is directional (that's why theres an arrow, and not just a line). To explain this, take a look at the type definition of the `out` argument of the `multiplyByTwo` function :

```go
out chan<- int
```

- The `chan<-` declaration tells us that you can only put stuff _into_ the channel, but not receive anything from it.
- The `int` declaration tells us that the "stuff" you put into the channel can only be of the `int` datatype.

Although they look like separate parts, `chan<- int` can be thought of as one datatype, that describes a "send-only" channel of integers.

Similarly, an example of a "receive-only" channel declaration would look like:

```go
out <-chan int
```

You can also declare a channel without giving directionality, which means it can send or recieve data :

```go
out chan int
```

This is actually seen when we create the `out` channel in the `main` function :

```go
out := make(chan int)
```

The reason we had to make a bi-directional channel was because we were using it to _send_ data from the `multiplyByTwo` function and _receive_ that same data in the `main` function.

### Blocking code

Statements that send or receive values from channels are blocking inside their own goroutine.

This means that when we try to print the value received (in the `main` function) :

```go
fmt.Println(<-out)
```

The `<-out` statement will block the code _until_ some data is received on the `out` channel. It helps to then visualize this by splitting the `main` block into two parts : the part that runs until its time to wait for the channel to receive data, and the part that is run after.

![go routines as blocks with channel, with blocking code](/assets/images/posts/go-channels/goroutines-3.svg)

The second part of `main` can only be run once data is received through the channel, which is why the __green arrow__ connects to the second part.

The __dotted arrow__ added here is to show that it is the `main` function that started the `multiplyByTwo` goroutine.

## Example #2 - Two single directional channels

Example #1 can be implemented another way, by using 2 channels : one for sending data to the goroutine, and another for receiving the result.

```go
package main

import (
	"fmt"
)

func main() {
	n := 3
	in := make(chan int)
	out := make(chan int)

	// We now supply 2 channels to the `multiplyByTwo` function
	// One for sending data and one for receiving
	go multiplyByTwo(in, out)
	
	// We then send it data through the channel and wait for the result
	in <- n
	fmt.Println(<-out)
}

func multiplyByTwo(in <-chan int, out chan<- int) {
	// This line is just to illustrate that there is code that is
	// executed before we have to wait on the `in` channel
	fmt.Println("Initializing goroutine...")

	// The goroutine does not proceed until data is received on the `in` channel
	num := <-in

	// The rest is unchanged
	result := num * 2
	out <- result
}
```

Now, in addition to `main`, `multiplyByTwo` is also divided into 2 parts: the part before and after the point where we wait on the `in` channel (`num := <- in`)

![go routines as blocks with channel](/assets/images/posts/go-channels/goroutines-4.svg)
