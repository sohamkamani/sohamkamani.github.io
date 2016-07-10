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

<!-- more -->

_All queries used in this post are made for PostgreSQL, although SQL syntax is very similar across databases, so some of these would work on MySQL, or other SQL databases as well_

## The three magic words

Although there are lots of keywords used in SQL, `SELECT`, `FROM`, and `WHERE` are the ones you would be using in almost every query that you make. After reading ahead, you would realize that these key words represent the most fundamental aspect of querying a database, and other, more complex queries are simply extensions of them.

## Our database

Let's take a look at the sample data we will be using throughout the rest of this article:

<iframe src="https://docs.google.com/spreadsheets/d/1HX6DhT0vkGzWEjoSKcvUovVN6jbVz6RVYgkQYSTZAuU/pubhtml?widget=true&amp;headers=false" class="google-docs-excel-table">
</iframe>

We have a library, with books and members. We also have another table for borrowings made.

-   Our "books" table has information about the title, author, date of publication, and stock available. Pretty straightforward.
-   Our "members" table only has the first and last name of all registered members.
-   The "borrowings" table has information on the books borrowed by the members. The `bookid` column refers to the id of the book in the "books" table that was borrowed, and the `memberid` column corresponds to the member in the "members" table that borrowed the book. We also have the dates when the books were borrowed, and when they are expected to be returned.

## Simple Query

Let's get started with our first query : We want the _names_ and _ids_ of all books written by "Dan Brown".

Our query would be :

```sql
SELECT bookid AS "id", title
FROM books
WHERE author='Dan Brown';
```

Which would give us :

| id  | title           |
| --- | --------------- |
| 2   | The Lost Symbol |
| 4   | Inferno         |

Simple enough. However, lets try to dissect the query to really understand whats happening.

### FROM - Where do we get the data from?

This might seem obvious now, but actually matters a lot when we get to joins and subqueries. `FROM` is there to point our query to its table, the place where it has to look for the data. This table can simply be one that already exists (like the previous example), or a table which we generate through joins or subqueries.

### WHERE - What data should we show?

`WHERE`, quite simply acts to filter out the **rows** that we want to show. In our case the only rows we want to consider are those where the value of the `author` column is "Dan Brown"

### SELECT - How should we show it?

Now that we got all the rows we wanted from the table that we wanted, the question that arises is what exactly do we want to show out of the data that we got? In our case we only need the name and id of the book, so that's what we `SELECT`. We can also rename the columns we want to show with `AS`.

In the end, you can represent the entire query as a simple diagram :

![](/assets/images/posts/sql-beginners/diagram1.svg)

## Joins

We would now like to see the names of all books (not unique) written by "Dan Brown" that were borrowed, along with the date of return :

```sql
SELECT books.title AS "Title", borrowings.returndate AS "Return Date"
FROM borrowings JOIN books ON borrowings.bookid=books.bookid
WHERE books.author='Dan Brown';
```

Which would give us :

| Title           | Return Date         |
| --------------- | ------------------- |
| The Lost Symbol | 2016-03-23 00:00:00 |
| Inferno         | 2016-04-13 00:00:00 |
| The Lost Symbol | 2016-04-19 00:00:00 |

<br>
Most of the query looks similar to our previous example _except_ for the `FROM` section. What this means is that _the table we are querying from ha changed_. We are neither querying the "books" table nor the "borrowings" table. Instead, we are querying a _new table_ formed by joining these two tables.

`borrowings JOIN books ON borrowings.bookid=books.bookid` can be considered as another table formed by combining all entries from the books table and the borrowings table, as long as these entries have the same `bookid` in each table. The resultant table would be :

<iframe src="https://docs.google.com/spreadsheets/d/1pHCgnSNmS3ut192JB6gAjzeJ1XmL9vRiaPvCl7aWZkE/pubhtml?gid=867473953&amp;single=true&amp;widget=true&amp;headers=false" class="google-docs-excel-table"></iframe>

Now, we just query this table like we did in the simple example above. This means that everytime we join a table, we just have to worry about how we join our tables. After that, the query is reduced in complexity to the level of the "Simple Query" example.

Let's try a slightly more complex join where we join 2 tables.

We now want the first name and last name of everyone who has borrowed a book written by "Dan Brown".

This time, we'll take a bottom-up approach to get our result :

-   **Step 1** - Where do we get the data from?
    To get the result we want, we would have to join the "member" table, as well as the "books" table with the "borrowings" table.
    The join section of the query would look like :

    ```sql
    borrowings
    JOIN books ON borrowings.bookid=books.bookid
    JOIN members ON members.memberid=borrowings.memberid
    ```

    The resulting table would be :

    <iframe src="https://docs.google.com/spreadsheets/d/1pHCgnSNmS3ut192JB6gAjzeJ1XmL9vRiaPvCl7aWZkE/pubhtml?gid=1040789930&amp;single=true&amp;widget=true&amp;headers=false" class="google-docs-excel-table"></iframe>

-   **Step 2** - What data should we show?
    We are only concerned with data where the author is "Dan Brown"

    ```sql
    WHERE books.author='Dan Brown'
    ```

-   **Step 3** - How should we show it?
    Now that we got the data we want, we just want to show the first name and the last name of the members who borrowed it :

    ```sql
    SELECT
    members.firstname AS "First Name",
    members.lastname AS "Last Name"
    ```

Awesome! Now we just have to combine the 3 components of our query and we get :

```sql
SELECT
members.firstname AS "First Name",
members.lastname AS "Last Name"
FROM borrowings
JOIN books ON borrowings.bookid=books.bookid
JOIN members ON members.memberid=borrowings.memberid
WHERE books.author='Dan Brown';
```

Which gives us :

| First Name | Last Name |
| ---------- | --------- |
| Mike       | Willis    |
| Ellen      | Horton    |
| Ellen      | Horton    |

Awesome! Although, the names are repeating (non-unique). We'll get to solving that in a bit...

## Aggregations

In a nutshell, _aggregations are used to convert many rows into a single row_. the only thing that changes is the logic used on each column for its aggregation.

Let's continue with our previous example, where we saw that there were repetitions in the results we got from our query. We know that Ellen Horton borrowed more than one book, but this is not really the best way to show this information. We can write another query :

```sql
SELECT
members.firstname AS "First Name",
members.lastname AS "Last Name",
count(*) AS "Number of books borrowed"
FROM borrowings
JOIN books ON borrowings.bookid=books.bookid
JOIN members ON members.memberid=borrowings.memberid
WHERE books.author='Dan Brown'
GROUP BY members.firstname, members.lastname;
```

Which would give us our required result :

| First Name | Last Name | Number of books borrowed |
| ---------- | --------- | ------------------------ |
| Mike       | Willis    | 1                        |
| Ellen      | Horton    | 2                        |

<br>
Almost all aggregations we do come with the `GROUP BY` statement. What this does is convert the table otherwise returned by the query into groups of tables. Each group corresponds to a unique value (or group of values) of columns which we specify in the `GROUP BY` statement.  
In this example, we are converting the result we got in the previous exercise into groups of rows. We also perform an aggregation in this case `count`, which converts multiple rows into a single value (which in our case is the number of rows). This value is then attributed to each group.

Each row in the result represents the aggregated result of each of our groups.

![](/assets/images/posts/sql-beginners/diagram2.svg)

We can also logically come to the conclusion that all fields in the result must either be specified in the `GROUP BY` statement, or have an aggregation done on them. This is because all other fields will vary row wise, and if they were `SELECT`ed, we would'nt know which of their possible values to take.

In the above example, the `count` function worked on all rows (since we are only counting the number of rows). Other functions like `sum` or `max`, would work on only a specific row. For example, if we want the total stock of all books written by each author, we would query :

```sql
SELECT author, sum(stock)
FROM books
GROUP BY author;
```

And get the result :

| author         | sum |
| -------------- | --- |
| Robin Sharma   | 4   |
| Dan Brown      | 6   |
| John Green     | 3   |
| Amish Tripathi | 2   |

<br>

Here the `sum` function, only works on the `stock` column, summing all values for each group.

## Subqueries

<img src="/assets/images/posts/sql-beginners/meme1.jpg" style="width:60%;"/>

Sub queries are regular SQL queries, that are embedded inside larger queries.

There are 3 different types of subqueries, based on what they return -

1. __2-dimensional table__ - These are queries that return more than one column. A good example is the query we performed in the previous aggregation excercise. As a subquery, these simply return another table which can be queried further. From the previous excercise, if we only want 

## Write Operations
