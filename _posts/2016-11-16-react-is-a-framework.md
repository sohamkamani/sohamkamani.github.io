---
layout : post
title : React is a framework
date: 2016-11-16T08:45:12.000Z
categories: javascript node js react redux
comments: true
---

One of the more common phrases you hear anytime you talk about ReactJs is :

>React is not a framework, its a library

or

>React is just the "V" in "MVC"

This would have made sense when the React ecosystem was still in its early stages, but it doesn't hold true anymore. To clarify, nothing about React has fundamentally changed since it first released. What has changed, however, is what people think when they think of React.

When someone says "We have used React to build our web application", they almost never mean that React is _all_ they use (contrary to other frameworks like angular or ember). In fact, it's actually impossible to make a website *only* with React. This is because the only thing React (and I mean the actual React library) does, is provide a way to represent and update HTML as functions. To actually call and render those functions on a browser, you would need ReactDOM as well.

The term "React" is now used more to refer to an entire stack of libraries and frameworks rather than the React library alone. The obvious problem with this is, that different people have a different perception of what an ideal React stack is. For me personally, I have sometimes (wrongly) assumed that any website using React is _obviously_ using redux for state management as well.

Like it or not, the term "React" has now become synonymous with a framework consisting of isolated libraries that have come to support the functionality required in a full fledged framework. This is both a pain in backside, and a blessing in disguise.

On one hand, if you do not like a certain part of a framework, you normally have to go to great lengths and "go against the grain" to make it work your way. This is totally different in the case of the React "framework" :

- Don't like the JSX style routing in [react-router](https://github.com/ReactTraining/react-router) ? Just use [something else](https://github.com/larrymyers/react-mini-router)!
- Don't like the amount of boilerplate [redux](https://github.com/reactjs/redux) comes with? Use something like [jumpsuit](https://github.com/jumpsuit/jumpsuit) instead!
- Don't like [webpack](https://webpack.github.io/) to bundle your modules? Try [rollup](https://github.com/rollup/rollup) for a change. Or if you don't want to use bundles at all, you can still use react with plain old script tags.

The multitude of choices we have can give us a sense of relief... a sense of security that there are so many libraries out there that there has to be _atleast one_ that does what I want it to do. On the flip side, it can also make you feel like [this](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.sg7kkylig) -- and that's precisely the problem. The amount of libraries out there creates a sort of [paradox of choice](https://en.wikipedia.org/wiki/The_Paradox_of_Choice), because of which we always feel that we could have chosen a better set of libraries to compose our framework. In fact, there are _so many_ choices of libraries out there, that there exists a [tool](http://andrewhfarmer.com/starter-project/) to help you search for the perfect boilerplate to suit your needs. We can even consider each boilerplate project to be its own framework because of the vastly different choices of libraries and convention seen between any two.

This kind of mental load of choosing the right boilerplate is rarely, if ever, present in other fully featured frameworks... but for some reason, I have always found myself complaining about atleast _some_ part of any of these that I use (After all, no one's perfect).

In the end, this post is not a rant about the current state of the React ecosystem, nor one about the lack of choice in other frameworks. It is simply a reflection on the direction the current React ecosystem is headed. React has not only changed the way we think about our code, but has also brought a whole ecosystem along with it, and that is always something to appreciate.
