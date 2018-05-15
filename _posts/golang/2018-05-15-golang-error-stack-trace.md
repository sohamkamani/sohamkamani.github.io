---
layout: post
title: How to generate an error stack trace in Go 🥞
date: 2018-05-15T01:45:12.000Z
categories: go golang
description: "This post describes how to generate an error stack trace in Go"
comments: true
---

A common problem that many people (including me) have faced when programming in Go, is to pin point the source of an error. Other programming languages provide you with a stack trace to tell you where the error came from, but Go does not have this behavior by default.

In this article, we will discuss how to use the `fmt`, and the [`github.com/pkg/errors`](https://github.com/pkg/errors) libraries to give us better error reporting.

<!-- more -->

Consider this example:

```go
package main

import (
	"fmt"
	"errors"
)

func main() {
	result, err := caller1()
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	fmt.Println("Result: ", result)
}

func caller1() (int, error) {
	err := caller2()
	if err != nil {
		return 0, err
	}
	return 1, nil
}

func caller2() error {
  doSomething()
	return caller3()
}


func caller3() error {
	return errors.New("failed")
}
```
[Try it here](https://play.golang.org/p/p4PJ4lOoX_F)

Running this program would output:

```
Error:  failed
```

Now, this does not really tell us much. What we really want to know is the cause of the error (which, in this case is the `caller3` function), and where the error came from (which would be the stack trace leading up to `caller3`)

## Using the standard library

We can use the `fmt.Errorf` function to wrap other errors and effectively generate a trace:

```go
//caller1 and caller2 can be modified to wrap the errors with `fmt.Errorf` before returning them

func caller1() (int, error) {
	err := caller2()
	if err != nil {
		return 0, fmt.Errorf("[caller1] error in calling caller2: %v", err)
	}
	return 1, nil
}

func caller2() error {
	doSomething()
	err := caller3()
	if err != nil {
		return fmt.Errorf("[caller2] error in calling caller 3: %v", err)
	}
	return nil
}
``` 
[Try it here](https://play.golang.org/p/DYqFgMxaIeU)

Running this would give you:

```
Error:  [caller1] error in calling caller2: [caller2] error in calling caller 3: failed
```

This time, the error is much more descriptive, and tells us the sequence of events that lead to the error. Wrapping errors in the format: "`[<name of the function>] <description of error> : <actual error>`" gives us a consistent way to find its cause.

## But what about custom error types?

Consider having an error type that also has an additional error code:

```go
type CustomError struct {
  Code int
}

func (c *CustomError) Error() string {
  return fmt.Sprintf("Failed with code %d", c.Code)
}
```

If you wrap this error with `fmt.Errorf`, its original type will be lost, and you won't be able to access the `Code` struct attribute, or even tell that the error is of type `CustomError`

The solution to this lies in the [`github.com/pkg/errors`](https://github.com/pkg/errors) libraries `errors.Wrap`, and `errors.Cause` functions.

```go
import (
	"fmt"
	"github.com/pkg/errors"
)

func main() {
	err := &CustomError{Code: 12}
	// lostErr := fmt.Errorf("failed with error: %v", err)
	// there is no way we can get back the `Code` attribute from `lostErr`

	wrappedErr := errors.Wrap(err, "[1] failed with error:")
	twiceWrappedError := errors.Wrap(wrappedErr, "[2] failed with error:")

  // The `errors.Cause` function returns the originally wrapped error, which we can then type assert to its original struct type
	if originalErr, ok := errors.Cause(twiceWrappedError).(*CustomError); ok {
		fmt.Println("the original error coed was : ", originalErr.Code)
	}	
}
```

Adding a trail to errors in Go is almost necessary for any medium to large application if you don't want to lose your head debugging its cause. Using the "errors" library lets you maintain the trail, while still retaining the benefits of inspecting the original error.