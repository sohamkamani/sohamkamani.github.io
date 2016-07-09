---
layout: post
title: A beginners guide to thinking in SQL
date: 2016-07-07T00:45:12.000Z
categories: sql beginners guide tutorial
comments: true
---

> Is it "`SELECT * WHERE a=b FROM c`" or "`SELECT WHERE a=b FROM c ON *`" ?

If you're anything like me, SQL is one of those things that may look easy at first (it reads just like regular english!), but for some reason you can't help but google the correct syntax for every silly query.<br>
Then, you get to joins, aggregation, and subqueries and everything you read just seems like gibberish. Something like this :

```sql
select users.firstname || ' ' || users.lastname as user,
    website.name as sitename,
    case
        when users.userid = 0 then
            courses.slots*website.guestcost
        else
            courses.slots*website.membercost
    end as cost
        from
                public.members users                
                inner join public.coursebookings courses
                        on users.userid = courses.userid
                inner join public.facilities website
                        on courses.facid = website.facid
        where
        courses.starttime >= '2014-09-14' and
        courses.starttime < '2014-09-15' and (
            (users.userid = 0 and courses.slots*website.guestcost > 30) or
            (users.userid != 0 and courses.slots*website.membercost > 30)
        )
order by cost desc;
```

Yikes! This would scare any new comer, or even an intermediate developer looking at SQL for the first time. It shouldn't have to be like this.

It's always easy to remember something which is intuitive, and through this guide, I hope to ease the barrier of entry for SQL newbies, and even for people who have worked with SQL, but want a fresh perspective.  

_All queries used in this post are made for PostgreSQL, although SQL syntax is very similar across databases, so some of these would  work on MySQL as well_

## The three magic words

### The three magic words

#### The three magic words


Although there are lots of keywords used in
