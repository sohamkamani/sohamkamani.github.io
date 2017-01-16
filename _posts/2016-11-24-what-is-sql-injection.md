---
layout: post
title:  Web security essentials - SQL Injection 🔑
date:   2016-11-24 08:45:12
categories: web security sql injection
comments: true
---

So you thought your database was completely safe? Well, for the most part, it actually is. Modern databases have _lots_ of security features to prevent them from being compromised by an attacker. However, even with the most secure database, there is still a way in which a backdoor can be created to compromise it right from the browser!  

This post will explain why SQL injection occurs and how you can prevent it.

<!-- more -->

For starters, lets assume there's a simple form on your website to sign up a new user.

![signupform](/assets/images/posts/web-security-essentials/signupform.png)

Now as soon as you sign up a new user, you have to create a new entry in the database.

From the backend, the database query would look something like :

```sql
INSERT INTO `users` (username, password) VALUES ('<username>', '<password>');
```

What you would now do is replace `<username>` and `<password>` with the values entered in our sign up form. So, if I entered my username as `John Doe`, and password as `j0hnd03`, my insert query would like :

```sql
INSERT INTO `users` (username, password) VALUES ('John Doe', 'j0hnd03');
```

Now, for a normal use case, this would work just fine. But what happens if I got smart and changed my username to ``','');DROP TABLE `users`;-- `` ?

Once we insert this username into our query, it turns into :

```sql
INSERT INTO `users` (username, password) VALUES ('','');DROP TABLE `users`;--', '<password>');
```

Woah... what happened here? It turns out, that this query recognizes special characters like `` ` `` , `"` , or `-` as part of the query, and not as part of the input parameters. Since we are naively concatenating the entered username and password to generate our query, we don't exactly have a way to tell our query that these special characters should be a part of the username, and not a part of the query.

The result, as expected, is disastrous. In this case, it leads to our entire `users` table being dropped. Ouch!

### Preventing SQL Injection

Make sure you always escape all your SQL queries! This means replacing special characters like `` ` `` , `"` with their escaped versions (i.e `` \` `` and `\"`)

This is actually easier said than done, considering larger projects often have hundreds of queries with even more parameters to take care of, and it's often impossible to make sure _everything_ is escaped. The solution?

__Use an ORM instead of writing your own queries.__ ORMs like [this one](https://ponyorm.com/#) for python, or [this one](http://sequelize.readthedocs.io/en/v3/) for NodeJs make sure that your queries are safe, even if you have a lot of questionable characters in your input parameters.

If you want to learn more about security on the web, be sure to read my [other posts on web security essentials](/blog/2017/01/16/web-security-essentials/) :

[XSS (Cross site scripting)](/blog/2016/11/24/web-security-xss/)  
[CORS (Cross origin resource sharing)](/blog/2016/12/21/web-security-cors/)  
[Password storage](/blog/2017/01/01/web-security-password-storage/)  
[Sessions and cookies](/blog/2017/01/08/web-security-session-cookies/)  
[CSRF (Cross site request forgery)](/blog/2017/01/14/web-security-cross-site-request-forgery/)  
[Human Error and UI/UX design](/blog/2017/01/14/web-security-human-error/)

