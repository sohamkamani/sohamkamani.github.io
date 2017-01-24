---
layout: post
title:  Web security essentials - CSRF (Cross site request forgery) 🔑
date:   2017-01-14 08:45:12
categories: web security csrf xsrf cross site request forgery
comments: true
---

Cross site request forgery (CSRF or XSRF), is a type of attack where a request coming from one website is disguised so as to give the impression that it's coming from another. A XRSF attack is especially deadly as it can go completely unnoticed by a user, and even by the server being targeted.

This post explains what causes CSRF attacks, and what you can do to prevent them as a developer.

<!-- more -->

## What is CSRF and how does it happen?

It's all in the name :

- __Request forgery__ : Sending a request which appears to be legitimate but is actually malicious.
- __Cross site__ : coming from a site other than the one for which it is intended.

But how can these other sites send such a request, and how can it be forged to appear like a legitimate request? The answer lies in the design of web browsers and how they send requests.  

Consider two websites : a not-so-innocent news website (lets call it _sillyfakenews.com_), and your go-to social media portal (lets call it _facehook.com_). Let's say you're already logged in to _facehook.com_, on another tab in your browser. One of the many posts you see on it includes a link to _sillyfakenews.com_, and since it looks interesting you open it in another tab, while still logged into facehook.

It turns out that _sillyfakenews.com_, along with showing you news, is also trying to compromise your facehook account. It sends a `POST` request to facehook to unfriend a few people on your friend list (This can be done very easily by using HTML forms and a bit of javascript. Any website can actually make an invisible form and even submit it on your behalf, without you ever having to click a button. Check out the [input hidden](http://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_input_type_hidden) field to see how).

Now, since you already have an active session with facehook on the same browser ,and most likely have session information stored in the form of [cookies](/blog/2017/01/08/web-security-session-cookies/), all this information is now sent along with the forged request. According to the facehook server, it's as if this request was sent from the user while browsing on their site itself, and is therefore treated as a legitimate request.

The way browsers are designed, _any_ request made from _any_ site is treated the same with respect to cookies. This is why even though the request to facehook is _sent_ from _sillyfakenews.com_, all the cookies associated with the current logged in session in _facehook.com_ are sent as well.

![demo comic](/assets/images/posts/web-security-essentials/xsrf-demo.svg)

## CSRF Prevention

Now you may be cursing the browser for letting requests just go through with cookies like that, but there are measures you can take to ensure that these attacks don't take place with users on your site.

### Prevent cross origin requests

The easiest thing you can do to block HTTP requests coming from other websites on the browser is to prohibit cross origin requests.

If you want to know about cross origin requests and the same origin policy, you can read [my other post](/blog/2016/12/21/web-security-cors/) covering this topic in detail. In a nutshell, most popular browsers respect the "same origin policy" where by default, or if the server specifies it, requests going out from an origin other than the one the current site is being served from are prevented from going through by the browser.

Since this is basically something a browser respects, CSRF would still be a legitimate security concern if our user was using a browser that did'nt enforce the same origin policy. We therfore have to take other measures as well.

### Issue a CSRF token

This is the most popular method to counter CSRF potential attacks. With every session the user is on, a unique CSRF token is issued. This token is a bunch of random characters that cannot be predicted by any potential adversaries.

Everytime the client makes a request, the CSRF token is embedded in one of the fields (most of the times in the request header). This token is then verified on the server.

This way, even if another site sends a malicious request with the cookies from _facehook.com_, the request still won't contain the CSRF token, and so will not be entertained by the server.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[SQL Injection](/blog/2016/11/24/what-is-sql-injection/)  
[CORS (Cross origin resource sharing)](/blog/2016/12/21/web-security-cors/)  
[Password storage](/blog/2017/01/01/web-security-password-storage/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)  
[XSS (Cross site scripting)](/blog/2016/11/24/web-security-xss/)  
[Human Error and UI/UX design](/blog/2017/01/14/web-security-human-error/)
