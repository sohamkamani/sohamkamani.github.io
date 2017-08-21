---
layout: post
title:  Web security essentials - Password storage 🔑
date:   2017-01-01 08:45:12
categories: web security password storage encryption
comments: true
---

Passwords are a nightmare. If you _can_ offload password storage to a third party provider, you should _totally_ do that. This is not possible a lot of the time (especially if you want to keep your users data to yourself), and in cases like this, you would have to bite the bullet and manage passwords yourself.

This post will explain password storage in baby steps, so that we can understand why passwords are stored the way they are, and why it's not as straightforward as it seems.

<!-- more -->

## Method #1 - Just store it like anything else

I can hear you say  "What's all the fuss about! Why can't I just store the password like any other data?".

In this case you could have a database with a table consisting of `username` and `password` columns, with passwords stored like this :

username|password
-|-
john|myawesomepassword

<br/>

__The problem :__ This is horribly insecure. Something as simple as a system administrator keeping his laptop open by mistake could lead to your users passwords being compromised.

>Side note : If any website you go to emails you your _actual_ password in case you forgot it, they probably store your password this way. You should run away, and fast.

## Method #2 - Encryption

Ok, so maybe storing a password directly isn't such a good idea. Lets try giving it some form of encryption to make it a little more secure.

As an example, let's replace every letter of the password with the next letter in the alphabet.

username|password
-|-
john|nzbxftpnfqbttxpse

<br/>

Looks good. Now even if you someone looks at this table they wouldn't know the actual password. And if we want to log someone in, all we have to do is unencrypt this password and compare it with the password entered by the user on login.

__The problem :__ There is still _someone_ who has knowledge of the passwords in the system : the person who wrote the encryption algorithm. In our case, we _know_ that the password is formed by incrementing each letter to the next, so retrieving a users password is entirely possible for us. As long as _anyone_ can find out a users password, the system is never truly secure. You could come up with an algorithm as complex as you'd like, but as long as it's _reversible_, its as easy to crack as this one.

## Method #3 - Irreversible encryption

Instead of using your own derived encryption algorithm, you should use an established hashing algorithm like md5 or sha-1. These hashing algorithms cannot be reversed in theory.

This means that just because we know the md5 hash of a word, doesn't mean we can find out what that word is if we only have its md5 hash.

Lets revise our table to include the md5 hash of the password.

username|password
-|-
john|3729ad9ab30ed75be1f22a5f250f07ac

<br/>

Now, even if _we_ see this table, it would be impossible for us to find out the original password from this hash. Now, if we want to log a user in, we have to hash the entered password and compare it to the hash in the table. This is perfect! ... or is it?

__The problem :__ Turns out people are more similar than you think, and as a result you will find many passwords which are just common words and phrases. Many websites like [this one](http://md5.gromweb.com/) have lookup tables of  md5 hashes of common words. This means that if your user set a common word as his password, it can be easily looked up and cracked.

To prove my point, here are some md5 hashes of common words :

- lettuce : 8cbd191432b5f52b48497313f966a4f8
- cat : d077f244def8a70e5ea758bd8352fcd8
- bottle : 3a385ac07dcec4dde1a4ca47a9802c96

Now go [here](http://md5.gromweb.com/) and enter these hashes to reverse them and realize your whole life was a lie.

## Method #4 Irreversible encryption + salt

We know that look up tables exist for common words, and we also know that we can't trust our users to not use common words. Many websites try to prevent this by forcing users to enter a combination of letters, numbers and special characters (and to be honest, it's really irritating). A better alternative is to salt the users password.

"Salt" is a fancy term that means to add a random string of letters and numbers to a users password, and _then_ hash it. This more or less guarantees that the word is unique and unconventional, and therefore cannot be part of a lookup table.

![salt](/assets/images/posts/web-security-essentials/password-salt-chart.svg)

The final output you see has two $ symbols, between which the salt used to generate the rest of the hash lies. This is so that we can compare this hash with a user entered password.

If a user enters a password on login, in order to compare it to our existing tables of salted passwords, we first read the salt from the password we want to compare it to (the part between the $ symbols) append the salt to the entered password, hash the result, and compare the output of this hash to the part on the right of the second $ symbol.

Congratulations! You now have a decently secure form of password storage. You are now in a situation where no one, not even you, can ever find out your users passwords.

>Side note : this is also why almost all websites ask you to reset or create a new password, rather than reveal the password to you directly.

If you _still_ feel that your password is not secure enough (and for some  cases you should), you finally arrive at :

## Method #5 Repeated hashing

Remember what we did in method #4? Now, take the result, perform method #4 on it... now take _that_ result and perform method #4 on it again, and again.

Normally this is done an arbitrary number of times. If you thought reversing a hash is hard, try doing it many times over!

The steps to compare two passwords involves repeatedly hashing the entered password the same number of times and comparing the result to the stored hash.

## Implementing secure password storage

Restating the point I made in the beginning of this post, never write your own password storage or authentication code if you don't have to. The same goes for implementation of password storage.

If you want to implement these steps for fun and learning, thats all good, but for production usage, you would be much better off using existing libraries. [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) is a good example of an algorithm used for hashing and salting passwords. It also has implementations and libraries in most programming languages.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[SQL Injection](/blog/2016/11/24/what-is-sql-injection/)  
[CORS (Cross origin resource sharing)](/blog/2016/12/21/web-security-cors/)  
[XSS (Cross site scripting)](/blog/2016/11/24/web-security-xss/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)  
[CSRF (Cross site request forgery)](/blog/2017/01/14/web-security-cross-site-request-forgery/)  
[Human Error and UI/UX design](/blog/2017/01/14/web-security-human-error/)


