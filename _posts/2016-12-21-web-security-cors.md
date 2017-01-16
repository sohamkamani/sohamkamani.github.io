---
layout: post
title:  Web security essentials - CORS (Cross origin resource sharing) 🔑
date:   2016-12-21 08:45:12
categories: web security cors cross origin resource sharing
comments: true
---

CORS, or cross origin resource sharing, is one of the most misunderstood concepts of web security. Many know what it is, some know why we need it, and only a few know its limitations.

This post will go through some of the key concepts of CORS, and emphasize why we need it for the modern web.

<!-- more -->

## What is CORS?

The best way to explain it is through an example.  

First, Open up your browser, and navigate to  [stackoverflow.com](http://stackoverflow.com/).

Next, open up your browsers console, and run this snippet :

```js
fetch('http://stackoverflow.com').then(res => console.log(res))
```

You should see this nice clean response returned back, like this :

![console](/assets/images/posts/web-security-essentials/cors-console.png)

All fine and dandy! We used the browsers `fetch` API to get the content of stackoverflow's webpage, by making an http request. Now, lets try getting wikipedias homepage instead :

```js
fetch('http://wikipedia.org').then(res => console.log(res))
```

If you run this, you should see an error like this :

![console](/assets/images/posts/web-security-essentials/cors-console-no-origin.png)

It looks like we're not allowed to get the details of wikipedias homepage. In fact, if you make a request to _any_ origin other than stackoverflow, you will see this error. _However_, if you open your console on any wikipedia page , and make a request for wikipedias homepage, you would get a good response once again.

To put it simply, _it is forbidden to make a request to any origin, other than the one your code is running in_, unless otherwise allowed by its server. This is called the __same origin policy__.

Almost all urls serving their resources will have a CORS policy. By default, if there is no policy, it is assumed that CORS is disabled. But why would anyone want to disable access to their origin? This brings us to our next section :

## Why isn't CORS allowed?

It might seem harmless to allow requests to another origin. After all, that url would receive millions of other requests from unknown sources anyways. The problem lies in the way browsers work.

All requests sent from your browser are treated the same. The server receiving them cannot distinguish the circumstances under which they were sent. This means that if you were logged in on one site, and browsing another (malicious) site, and http request made by that sites code to the first site, would be treated as a genuine request from _you_.

This means that this :

![console](/assets/images/posts/web-security-essentials/comic1.svg)

Could turn into this :

![console](/assets/images/posts/web-security-essentials/comic2.svg)

## How strictly is CORS enforced?

This is often the most misunderstood aspect of CORS. It's quite contradictory that one cannot make a simple http request from their own browser to a different origin, but you can make the same request using something like [postman](https://www.getpostman.com/) or `curl` from the command line.

_If these kind of requests cannot be made from the browser, how are they so easily made through these third party applications, which can be equally as malicious?_

CORS isn't actually _enforced_ by the server, but rather the _browser_. The server simply states the sites that are allowed cross origin access through the `Access-Control-Allow-Origin` header in all its responses. _It is up to the browser to respect this policy_.

Of course, all popular browsers in use today do follow the same origin policy. Some applications like postman, curl do not respect this policy, because they are meant to be used as developer tools, and as such it is expected that the people using these tools know what they're doing.

![console](/assets/images/posts/web-security-essentials/corscomic.png)

## Caveats and exceptions

 1.__Fetch can make cross origin requests__ : Well... kind of. There is a `no-cors` mode that can be made use of to make cross origin requests with `fetch`, like this

```js
fetch('http://wikipedia.org', {
  mode: 'no-cors'
}).then(res => console.log(res))
```

However, you won't be able to read this response for the same reasons as before. This is only useful if you want to do things like response forwarding.

2.__CORS can be stricter than usual__ : The above comic is not always true. If a server really does not want other clients to receive a response, it can disable CORS for non browser clients as well. This means that you can _only_ make requests from the same origin, and that tools like postman and curl can't make requests either. Although this is possible, it generally isn't the case.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[XSS (Cross site scripting)](/blog/2016/11/24/web-security-xss/)  
[SQL Injection](/blog/2016/11/24/what-is-sql-injection/)  
[Password storage](/blog/2017/01/01/web-security-password-storage/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)   
[CSRF (Cross site request forgery)](/blog/2017/01/14/web-security-cross-site-request-forgery/)  
[Human Error and UI/UX design](/blog/2017/01/14/web-security-human-error/)

