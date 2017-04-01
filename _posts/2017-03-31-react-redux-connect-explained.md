---
layout: post
title: React-redux "connect" explained 🔗
date: 2017-03-31T01:45:12.000Z
categories: react redux connect
comments: true
---

Redux is a terribly simple library for state management, and has made working with React more manageable for everyone. However, there are a lot of cases where people blindly follow boilerplate code to integrate redux with their React application without understanding all the moving parts involved. 

There is an entire library, called [react-redux](https://github.com/reactjs/react-redux) whose sole purpose is to seamlessly integrate redux's state management into a React application. I feel that it's important to know what's going on when you do something that essentially forms the backbone of your application.

<!-- more -->

## React and redux on their own

At this point it's hard for some to believe, but redux and React are actually two separate libraries which can and have been used completely independent of each other. Lets take a look at redux's state management flow :

![redux flow diagram](/assets/images/posts/react-redux-explanation/redux-flow.svg)

If you have worked with redux before, you know that its functionality revolves around a "store", which is where the state of the application lives. There is no way anyone can directly modify the store. The only way to do so is through reducers, and the only way to trigger reducers is to dispatch actions. So ultimately :

>To change data, we need to __dispatch__ an action

On the other hand, when we want to retrieve data, we do not get it directly from the store. Instead, we get a snapshot of the data in the store at any point in time using `store.getState()` , which gives us the "state" of the application as on the time at which we called the `getState` method.

>To obtain data we need to get the current __state__ of the store

Now, let's come to the (simplified) component structure of a [standard react todo-mvc application](http://todomvc.com/examples/react/#/) :

![react flow diagram](/assets/images/posts/react-redux-explanation/react-flow.svg)

## Putting them together

If we want to link our React application with the redux store, we first have to let our app know that this store exists. This is where we come to the first major part of the react-redux library, which is the `Provider`.

`Provider` is a React component given to us by the "react-redux" library. It serves just one purpose : to "provide" the store to its child components.

```js
//This is the store we create with redux's createStore method
const store = createStore(todoApp,{})

// Provider is given the store as a prop
render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('app-node'))
```

Since the provider only makes the store accessible to it's children, and we would ideally want our entire app to access the store, the most sensible thing to do would be to put our `App` component within `Provider`.

If we were to follow the previous diagram, the `Provider` node would be represented as a parent node on top of the `App` node. However, because of the utility that `Provider` gives us, I feel it's more appropriate to represent it as something which "wraps" the entire application tree, like this :

![react flow diagram with provider](/assets/images/posts/react-redux-explanation/react-flow-provider.svg)

### Connect

Now that we have "provided" the redux store to our application, we can now _connect_ our components to it.
We established previously that there is no way to directly interact with the store. We can either retrieve data by obtaining its current state, or change its state by dispatching an action (we only have access to the top and bottom component of the redux flow diagram shown previously).

This is precisely what `connect` does. Consider this piece of code, which uses `connect` to map the stores state and dispatch to the props of a component :

```js
import {connect} from 'react-redux'

const TodoItem = ({todo, destroyTodo}) => {
  return (
    <div>
      {todo.text}
      <span onClick={destroyTodo}> x </span>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    todo : state.todos[0]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    destroyTodo : () => dispatch({
      type : 'DESTROY_TODO'
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoItem)
```

`mapStateToProps` and `mapDispatchToProps` are both pure functions that are provided the stores "state" and "dispatch" respectively. Furthermore, both functions have to return an object, whose keys will then be passed on as the props of the component they are connected to.

In this case, `mapStateToProps` returns an object with only one key : "todo", and `mapDispatchToProps` returns an object with the `destroyTodo` key.

The connected component (which is exported) provides `todo` and `destroyTodo` as props to `TodoItem`.

![final connect flow](/assets/images/posts/react-redux-explanation/final-connect-flow.svg)

It's important to note that only components _within_ the `Provider` can be connected (In the above diagram, the connect is done _through_ the Provider).

Redux is a powerful tool and even more so when combined with React. It really helps to know why each part of the `react-redux` library is used, and hopefully after reading this post, the function of `Provider` and `connect` is clear. 

If you want to know how to use redux in an efficient and easy to use manner for calling APIs, you should read my other post on [a simplified approach to calling APIs with redux](/blog/2016/06/05/redux-apis/)