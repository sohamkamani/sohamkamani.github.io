---
layout: post
title:  Web security essentials - Human error and UI/UX design 🔑
date:   2017-01-14 08:45:12
categories: web security human error phishing
comments: true
---

Throughout my other posts on web security, we looked at everything that could go wrong with our application from a technical perspective. However, despite all our efforts to make our application objectively as secure as possible, there is still one thing we should keep in mind : our application is going to be used by humans, and humans invariably make mistakes. 

Many potential adversaries are aware of this fact and use every opportunity to take advantage of it :

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This is the closest I&#39;ve ever come to falling for a Gmail phishing attack. If it hadn&#39;t been for my high-DPI screen making the image fuzzy… <a href="https://t.co/MizEWYksBh">pic.twitter.com/MizEWYksBh</a></p>&mdash; Tom Scott (@tomscott) <a href="https://twitter.com/tomscott/status/812265182646927361">December 23, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This tweet was posted by Tom Scott, a guy who has posted [multiple videos](https://www.youtube.com/watch?v=-enHfpHMBo4&list=PL96C35uN7xGLux5q2c4P_IqbKF11-pfsR) on security on the internet. If someone like him can _almost_ fall for an attack like this, chances are, most non-technically oriented people will too.

We as developers should do our best to make sure our users do not get fooled, or are put at risk due to their own mistakes.

Here are a few tips you can implement on your website to save your users from themselves :

<!-- more -->

## 1. Watch your external content

Ads are a necessary evil. No one wants to put them their website, but sometimes, they are the only way to pay the bills. What we _can_ do, however, is watch where and how we place this kind of external content, because this is something we do not have full control over.

At its worst, misplaced external content can end up making a content hosting site look like this :

![ads image](/assets/images/posts/web-security-essentials/human-error-1.png)

Which one's the _actual_ download button? After some experimentation, I found out that it's the little red one on the bottom right. But that was certainly not my first guess. The other links lead to a direct `.apk` (android app installation file) download, which could potentially be harmful if opened on an android phone.

Ads and other external content should be placed away from the main content, and it also helps to explicitly mention ads by putting a small label next to them.

## 2. Re-authenticate users for super sensitive actions

There is a chance that someone might leave their laptop open by mistake in a place where others can access it (think about all the times your friends posted a scandalous facebook status on your behalf). While some actions are relatively harmless, others have much costlier implications. 

This is why users should always be reauthenticated before performing an action that may compromise their security. For example, many websites like Google require you to enter your password again if you are changing your phone number, alternate email, or date of birth.

## 3. Log your users out after some time

Joe went and visited a public internet cafe to check his bank details online. The problem is that Joe, being the careless person that he is, forgot to log out of his online banking portal. 

Ordinarily anyone who uses that same computer would now have access to Joes banking portal. Fortunately, the banking portal had a session expiry time of 15 minutes, which means that if there is no activity on the website for more than 15 minutes, the current user is automatically logged out.

Always keep an expiry time for sessions on your site. It doesn't have to be 15 minutes, but make sure it's _there_.

## 4. Give your users a warning when they enter potentially dangerous areas

If there is a chance that the area your users are entering could potentially compromise their accounts' security, it's always better to give them a warning.

A common example is the "You are being redirected to another site" warning that pops up when you click on links to external websites.

Another example, which I thought was really clever, is Facebook's warning message which pops up when you open the browser console :

![facebook console image](/assets/images/posts/web-security-essentials/facebook-console-message.png)


## 5. Extra caution always helps

This may not be necessary for all occasions, but it's still something worth appreciating. 

Every time I sign in to my Google or Twitter account from a new device, or from a location different from the one I am usually in, I get an email letting me know.

Letting a user know when they have logged in from another can do a great deal in preventing a lot of damage _if_ someone _has in fact_ hacked in to their account.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[XSS (Cross site scripting)](/blog/2016/11/24/web-security-xss/)  
[CORS (Cross origin resource sharing)](/blog/2016/12/21/web-security-cors/)  
[Password storage](/blog/2017/01/01/web-security-password-storage/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)  
[CSRF (Cross site request forgery)](/blog/2017/01/14/web-security-cross-site-request-forgery/)  
[SQL Injection](/blog/2016/11/24/what-is-sql-injection/)  
