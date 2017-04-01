---
layout: post
title:  A simplified approach to calling APIs with redux ⏬
date:   2016-06-05T08:45:12.000Z
categories: react redux apis
comments: true
---

Redux has taken the web development by storm, and after the success of react and flux, it has made the flux philosophy more accessible through its simplified approach. Although, something has always bothered me about redux :

>Why is it so complicated to call APIs?!

The [async actions tutorial](http://redux.js.org/docs/advanced/AsyncActions.html) given in the documentation is no doubt a scalable approach to handling these kind of situations, but it's not very simple, and you would need to go over it a couple of times before you get used to the idea. Sometimes, we need a simpler method for addressing API calls in apps that are not-so-complex.

This post will go through an alternative design pattern, to make async actions and API calls easier for smaller apps (and perhaps for larger ones as well), while respecting [the three principles of redux](http://redux.js.org/docs/introduction/ThreePrinciples.html) and [one way data flow](https://facebook.github.io/flux/docs/overview.html).
<!-- more -->

## Prerequisites

You should be comfortable with [redux](https://github.com/reactjs/redux)(and probably [react](https://github.com/facebook/react)) by now. An understanding of [redux middleware](http://redux.js.org/docs/advanced/Middleware.html) would be nice, although it is not required (Just know that middleware is what comes in between dispatching an action and updating the store).

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

The data service we just created uses redux's standard [middleware signature](http://redux.js.org/docs/api/applyMiddleware.html). Also, we use the library [superagent](https://github.com/visionmedia/superagent), an awesome HTTP library for making AJAX calls.
<div id="naming-convention"/>
>A useful naming convention for data service action types is "`<ACTION>_<NAME>_<STATUS>`"

In our case we are _getting_ data for our todo list, which we choose to name `TODO_DATA`, so when we first request for it the action name is just `GET_TODO_DATA`, and on completion, we get the status of our `GET_TODO_DATA` request, by appending the action type with either `ERROR` or `RECEIVED` (the exact words for these names are entirely up to you)

### Modifying the existing todo app

After creating the data service middleware, we import it and apply it to the todo app :

```js
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import todoApp from './reducers'
import App from './components/App'
import dataService from './services/data-service'

/*
Applying our middleware to the store
*/
let store = createStore(todoApp,{}, applyMiddleware(dataService))

render(
	<Provider store={store}>
	<App/>
</Provider>, document.getElementById('app-node'))

store.dispatch({type: 'GET_TODO_DATA'})
```

We also dispatch the API call once our app is done rendering initially.

We then modify our todos reducer so that it adds all todos on receiving data from our API :

```js
const todos = (state = [], action) => {
	switch (action.type) {
	case 'ADD_TODO':
		return [
			...state,
			todo(undefined, Object.assign(action, {
				id: state.length
			}))
		]
	case 'TOGGLE_TODO':
		return state.map(t =>
			todo(t, action)
		)
  /*
  Consider all received data as the initial list of
  todo items
  */
	case 'GET_TODO_DATA_RECEIVED':
		return action.data
	default:
		return state
	}
}
```

### Loading indicator

Since it takes time for the data to arrive after we request for it, it's important to put an indicator to let the user know that the data is currently loading. This is done by adding a boolean `loading` key to the application state.

For this, we make another reducer for the `loading` key, which returns `true` whenever we start an API request, and turns back to `false` when the API call is done.

```js
const loading = (state = false, action) => {
	switch (action.type) {
	case 'GET_TODO_DATA':
		return true
	case 'GET_TODO_DATA_RECEIVED':
		return false
	case 'GET_TODO_DATA_ERROR':
		return false
	default:
		return state
	}
}

export default loading
```

We then modify our TodoList component to show "Loading..." whenever the `loading` state key is true :

```js
const TodoList = ({ todos, onTodoClick, loading }) => (
  <ul>
		{loading ? 'Loading...': ''}
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)
```

## Scaling our data service

Although our data service works for now, it would be wise to be [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) if we want to call more than one API. To do this, we would make a "request generator", which is a curried function which takes `next` as an argument and returns a function which makes a request to the route we provide, and dispatches actions according to our [naming convention](#naming-convention).

```js
const getApiGenerator = next => (route, name) => request
	.get(route)
	.end((err, res) => {
		if (err) {
			return next({
				type: `${name}_ERROR`,
				err
			})
		}
		const data = JSON.parse(res.text)
		next({
			type: `${name}_RECEIVED`,
			data
		})
	})
```

Our data service would then change to :

```js
import request from 'superagent'

const getApiGenerator = next => (route, name) => request
	.get(route)
	.end((err, res) => {
		if (err) {
			return next({
				type: 'GET_TODO_DATA_ERROR',
				err
			})
		}
		const data = JSON.parse(res.text)
		next({
			type: 'GET_TODO_DATA_RECEIVED',
			data
		})
	})

const dataService = store => next => action => {
	next(action)
  const getApi = getApiGenerator(next)
	switch (action.type) {
	case 'GET_TODO_DATA':
		getApi('/data/todo-data.json', 'GET_TODO_DATA')
		break
	default:
		break
	}

};

export default dataService
```


Although this approach is not a silver bullet, it works well as a simple solution for smaller applications, and more importantly, preserves the 3 principles of redux.

>Our data service is *not* a reducer. It is not a pure function. It has side effects. It is simply a layer in between our actions and reducers which dipatches other actions.

The full source code of this example can be found [here](https://github.com/sohamkamani/blog-example__redux-data) and the working example can be seen [here](http://www.sohamkamani.com/blog-example__redux-data/).

If you want to know more about `connect`, `Provider` and the `react-redux` library, check out my post on [connecting React and redux](/blog/2017/03/31/react-redux-connect-explained/)