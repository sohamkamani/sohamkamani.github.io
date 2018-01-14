---
layout: post
title:  "Understanding Tensorflow - your first program"
date:   2018-01-07 08:45:12
categories: machine learning tensorflow python
comments: true
author: Soham Kamani
---

Tensorflow is a machine learning library released by Google, which is now one of the most popular machine learning libraries currently in use. While the name _"Tensorflow"_ might seem intimidating, it's actually a really neat library that can be used for many things outside of machine learning as well.

In fact, there will be no further mention of machine learning in this post, since we are only going to learn about the basics of the Tensorflow library. Once, you understand how the library works, it's application in AI and machine learning will come naturally.

<!-- more -->
## Hello world

Before we begin, you will need to install Tensorflow on your system. The best way to do this is to follow the installation instructions on the official website.

Once that's done, we can get started with our first program:

```python
import tensorflow as tf

a = tf.constant(3.0)
b = tf.constant(2.0)

c = a + b

sess = tf.Session()

print(sess.run(c))
```

Once you run this code on the python shell, you should see the output as `5.0`.

This may seem useless at first (I mean, all we are doing is adding two numbers). But there is a lot more going on under the hood. The code that we wrote does not actually add two numbers, but rather builds a pipeline to do so.

The statement `c = a + b`, does not add together the values `2` and `3` and assign it to `c`. The variable `c` actually stores the _operation_ of adding together the constants represented by `a` and `b`. 

The statement `sess = tf.Session()` creates a new context in which we can run the operations that we defined above, and `sess.run(c)` actually _runs_ the operation defined by `c`, and returns its result. The value `5.0` that we got as an output is only computed at this stage.

This pipeline can actually be used to compute any number of values. It just so happens that we blocked the entrance to our pipeline with constants, so we will always get the same result.

## Providing input to our pipeline

Our pipeline would be more useful, if we could provide actual values instead of constants, line in the last example. For this we use __placeholders__, which represent data that will come _eventually_.

>In this context, "eventually" means the time when we execute `sess.run`

```python
import tensorflow as tf

a = tf.placeholder(tf.float32)
# The `placeholder` method takes the datatype as an argument, which in our
# case is the float32 type
b = tf.placeholder(tf.float32)

c = a + b

sess = tf.Session()

# `sess.run` is executed again, but this time, we need to provide our placeholder
# values, without which the program will throw an error
print(sess.run(c, {a: 1, b:5}))
```

Output:
```
6.0
```

Now, the pipeline that we created will only be evaluated if we provide the values for the placeholders that we defined earlier.

>In Tensorflow speak, the pipelines that we were talking about is what is called _"flow"_, and the values that we put into it are called _"tensors"_

## Using higher dimensional structures and operations

Single numbers (or scalars) are not the only thing we can run through our flow. We can also put in vectors, or matrices, and even multi-dimensional tensors.

To enable our pipeline to be able to handle this, we can set the `shape` argument of the `tf.placeholder` method :

```python
import tensorflow as tf

a = tf.placeholder(tf.float32, shape=(2,1))
b = tf.placeholder(tf.float32, shape=(1,2))
# We provide the shape of each type of input as the second argument.
# Here, we expect `a` to be a 2-dimensional matrix, with 2 rows and 1 column
# and `b` to be a matrix with 1 row and 2 columns

c = tf.matmul(a, b)
# Instead of addition, we define `c` as the matrix multiplication operation,
# with the inputs coming from `a` and `b`

sess = tf.Session()

print(sess.run(c, {a: [[1],[2]], b:[[3,4]]}))
```

Output:
```
[[ 3.  4.]
 [ 6.  8.]]
```

## Going forward

Though the examples discussed here were very simple, it's easy to see how they can be combined and chained together to form complex networks that can be trained and used for real life problems.