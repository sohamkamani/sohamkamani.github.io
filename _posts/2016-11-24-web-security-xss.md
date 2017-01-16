---
layout: post
title:  Web security essentials - XSS 🔑
date:   2016-11-24 08:45:12
categories: web security xss
comments: true
---

XSS(Cross site scripting) attacks are one one of the easiest attacks to perform, and are often the starting point for many attackers looking to compromise your website. Fortunately, they are also one of the easiest to avoid.

<!-- more -->

The best way to explain what XSS is, is to dive right into an example. This is an HTML element :

```html
<div id="status">
  I am feeling alright
</div>
```

Let's assume this `div` is used to show your status on a popular social media site. It will be seen by many of your friends on their news feed and be seen as : "I am feeling alright". As a user, you can update your status to whatever you want, and it will appear inside this div element.

If you were to be a malicious user, you could change your status from "I am feeling alright" to "\<script\>alert('I am feeling great!')\</script\>", but the thing is, your friends would not see your status as "\<script\>alert('I am feeling great!')\</script\>", but instead, they would get an alert message which would look something like this :

![xss](/assets/images/posts/web-security-essentials/xss-alert.png)

This is because the text you just put in is rendered to HTML by default, which will make the content inside the div look like this :

```html
<div id="status">
  <script>
    alert('I am feeling great!')
  </script>
</div>
```

Everything inside the script tag is considered as javascript code and executed. Thus, everyone _across_ the site has this _script_ executed, and the attacker has now compromised the site.

Although this was a rather innocent example, there are a lot of more sinister things that can be done this way, like submitting a form on someone else's behalf.

### Preventing XSS

Make sure all information being rendered on the browser is HTML encoded first. This means converting some special characters to their HTML encoded equivalents first.

[Here's a list](http://www.degraeve.com/reference/specialcharacters.php) of all special characters in HTML and their character code in HTML.

Try it out for yourself! Enter some text with some sensitive HTML characters, and see the encoded output on the right :

<div style="display:flex; min-height:150px;">
<textarea style="flex:1 1 0;margin:5px;border:1px solid black;" id="in" placeholder="Type here..."></textarea>
<div id="out" style="flex:1 1 0;margin:5px;background:lightgrey;overflow-wrap: break-word;overflow-x:auto;"></div>
</div>

Many frameworks and tools like jQuery, angular, and react have this built in so you don't normally have to worry. But this is still something you should keep an eye out for.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[SQL Injection](/blog/2016/11/24/what-is-sql-injection/)  
[CORS (Cross origin resource sharing)](/blog/2016/12/21/web-security-cors/)  
[Password storage](/blog/2017/01/01/web-security-password-storage/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)  
[CSRF (Cross site request forgery)](/blog/2017/01/14/web-security-cross-site-request-forgery/)  
[Human Error and UI/UX design](/blog/2017/01/14/web-security-human-error/)


<script src="/assets/scripts/xhr-html-encode.min.js">
</script>
