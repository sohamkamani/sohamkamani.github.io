---
layout: post
title: Creating a mobile application with react and material design
date: 2015-12-28T18:45:12.000Z
categories: react material mobile
comments: true
---

There has been much progression in the hybrid app development space, and also in [React.js](https://facebook.github.io/react/). Currently, almost all hybrid apps use [cordova](https://cordova.apache.org/) for building and running web applications on the platform of choice. Although learning react can be a bit of a steep curve, the benefit you are getting is that you are forced to make your code more modular and this leads to huge long term gains. This is great for developing applications for the browser, but when it comes to developing mobile apps, most web apps fall short because they fail to create the "native" experience that so many users know and love, and implementing these features on your own (through playing around with css and javascript) may work, but its a huge pain for even something as simple as a material design oriented button.

Fortunately, there is a [library of react components](http://www.material-ui.com/#/) to help us out with getting the look and feel of material design into our web application, which can then be ported to mobile to get a native look and feel. This post will take you through all the steps required to build a mobile app with react and then port it to your phone using cordova.

## Prerequisites and dependencies
Globally, you would require cordova, which can be installed by executing :

```sh
npm install -g cordova
```

Now that thats done, you should make a new directory for your project, and set up a build environment for using es6 and jsx. Currently, webpack is the most popular build system for react, but if thats not according to your taste theres many more build systems out there.

Once you have your project folder set up, install react, as well as all the other libraries you would be needing :

```sh
npm init
npm install --save react react-dom material-ui react-tap-event-plugin
```

## Making your app

Once were done, the app should look something like this :

<img src="http://www.sohamkamani.com/blog-example__react-material/extras/images/app_screenshot.png" width="330px" height="600px">

If you just want to get your hands dirty, you can find the source files [here](https://github.com/sohamkamani/blog-example__react-material).

Like all web applications, your app will start with an index.html file :

```html
<html>

<head>
  <title>My Mobile App</title>
</head>

<body>
  <div id="app-node">
  </div>
  <script src="bundle.js" ></script>
</body>

</html>
```

Yup, thats it. If you are using webpack , your css will be included in the bundle.js file itself, so theres no need to put "style" tags either. This is the only html you need for your application. Next lets take a look at index.js, the entry point to the application code :

```js
//index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';

const node = document.getElementById('app-node');

ReactDOM.render(
  <App/>, node
);
```

All this does is grab the main `App` component and attaches it to the `app-node` DOM node. Drilling down further, lets look at the app.jsx file:

```js
//app.jsx
'use strict';

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import MyTabs from './my-tabs.jsx';

let App = React.createClass({
  render : function(){
    return (
      <div>
        <AppBar title="My App" />
        <MyTabs />
      </div>
    );
  }
});

module.exports = App;
```

Following react's philosophy of structuring our code, we can roughly break our app down into two parts :
- The title bar
- The tabs below

The title bar is more straightforward and directly fetched from the material-ui library. All we have to do is supply a "title" property to the AppBar component.

`MyTabs` is another component that we have made, put in a different file because of the complexity.

```js
'use strict';
import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Slider from 'material-ui/lib/slider';
import Checkbox from 'material-ui/lib/checkbox';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};

const TabsSimple = React.createClass({
  render: () => (
    <Tabs>
      <Tab label="Item One">
        <div>
          <h2 style={styles.headline}>Tab One Template Example</h2>
          <p>
            This is the first tab.
          </p>
          <p>
            This is to demonstrate how easy it is to build mobile apps with react
          </p>
          <Slider name="slider0" defaultValue={0.5}/>
        </div>
      </Tab>
      <Tab label="Item 2">
        <div>
          <h2 style={styles.headline}>Tab Two Template Example</h2>
          <p>
            This is the second tab
          </p>
          <Checkbox name="checkboxName1" value="checkboxValue1" label="Installed Cordova"/>
          <Checkbox name="checkboxName2" value="checkboxValue2" label="Installed React"/>
          <Checkbox name="checkboxName3" value="checkboxValue3" label="Built the app"/>
        </div>
      </Tab>
      <Tab label="Item 3">
        <div>
          <h2 style={styles.headline}>Tab Three Template Example</h2>
          <p> Choose a Date:</p>
          <DatePicker hintText="Select date"/>
        </div>
      </Tab>
    </Tabs>
  )
});

module.exports = TabsSimple;
```

This file has quite a lot going on, so lets break it down step by step :

1. We import all the components were going to be using in our app. This includes tabs, sliders, checkboxes, and datepickers.
2. `injectTapEventPlugin` is a plugin we need in order to get tab switching to work.
3. We decide the style used for our tabs.
4. Next, we make our `Tabs` react component, which consists of three tabs :
  - The first tab has some text along with a slider.
  - The second tab has a group of checkboxes.
  - The third tab has a pop-up datepicker.

Each component has a few keys which are specific to it (Like the initial value of the slider, the value reference of the checkbox, or the placeholder for the datepicker). There are a lot more properties you can assign, which is specific to each component, and you can find out more about them [here].

## Building your App

For building on android you would first need to install the [Android SDK](http://developer.android.com/sdk/installing/index.html).
Now that we have all the code in place, all that's left is to build the app. For this make a new directory and start a new cordova project, and add the android platform, by running the following on your terminal :

```sh
mkdir my-cordova-project
cd my-cordova-project
cordova create .
cordova platform add android
```

Once the installation is complete, build the code we just wrote previously. If you were using the same build system as the [source code](https://github.com/sohamkamani/blog-example__react-material), you will have just two files, that is `index.html` and `bundle.min.js`. Delete all the files currently present in the `www` folder of your cordova project and copy those two files there instead.

You can test if your app is working on your computer by running `cordova serve`, and going to the appropriate address on your browser.

If all is well, we can build and deploy our app :

```sh
cordova build android
cordova run android
```

This will build and install the app on your android device (provided it is in debug mode and connected to your computer).

Similarly, you can also build and install the same app for iOS or windows (you may need additional tools like xCode or .NET for iOS or windows). You can also use any other framework for building your mobile app. The angular framework also comes with its own set of [material design components](https://material.angularjs.org/latest/demo/autocomplete).
