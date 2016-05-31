---
layout: post
title:  A simplified approach to calling APIs with redux
date:   2016-05-06T08:45:12.000Z
categories: react redux apis
comments: true
---

Redux has taken the web development by storm, and after the success of react and flux, it has made the flux philosophy more accessible through its simplified approach. Although, something has always bothered me about redux :

>Why is it so complicated to call APIs?!

The [async actions tutorial](http://redux.js.org/docs/advanced/AsyncActions.html) given in the documentation is no doubt a scalable approach to handling these kind of situations, but it's not very simple, and you would need to go over it a couple of times before you get used to the idea. Sometimes, we need a simpler method for addressing API calls in apps that are not-so-complex.

This post will go through an alternative design pattern, to make async actions and API calls easier for smaller apps (and perhaps for larger ones as well), while respecting [the three principles of redux](http://redux.js.org/docs/introduction/ThreePrinciples.html) and [one way data flow](https://facebook.github.io/flux/docs/overview.html).

## Our application

We are going to build on top of the [redux to-do mvc example](https://github.com/reactjs/redux/tree/master/examples/todos), by adding an API call to load the initial set of todo items.

The proposed pattern would make use of 4 steps for each API call :

1. Dispatch an action when the application needs to call an API.
2. Render the application in a loading state for that particular API.
3. Dispatch an action when a response is received.
4. Render the application with the received data, or with an error message, depending on the response.

### Adding an API service as a middleware

We will be adding a middleware which listens to all our actions, and calls an API when the appropriate action type is received. All actions, including actions recognized by this service should pass through the data service transparently, so that the rest of our application can still use them.

The normal flow of data in any flux architecture would look like this :

![normal data flow](/assets/images/posts/redux-api/normal-flow.png)

Adding our data service middleware would result in a slightly modified flowchart:

![api data flow](/assets/images/posts/redux-api/api-flow.jpg)

We create our API service in a single file :

```js
import request from 'superagent'

const dataService = store => next => action => {
  /*
  Pass all actions through by default
  */
  next(action)
  switch (action.type) {
  case 'GET_TODO_DATA':
    /*
    In case we receive an action to send an API request, send the appropriate request
    */
    request
      .get('/data/todo-data.json')
      .end((err, res) => {
        if (err) {
          /*
          in case there is any error, dispatch an action containing the error
          */
          return next({
            type: 'GET_TODO_DATA_ERROR',
            err
          })
        }
        const data = JSON.parse(res.text)
        /*
        Once data is received, dispatch an action telling the application
        that data was received successfully, along with the parsed data
        */
        next({
          type: 'GET_TODO_DATA_RECEIVED',
          data
        })
      })
    break
  /*
  Do nothing if the action does not interest us
  */
  default:
    break
  }

};

export default dataService
```
