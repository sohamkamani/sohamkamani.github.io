---
layout: post
title: Using enums (enumerations) in javascript 📃
date: 2017-08-21T01:45:12.000Z
categories: javascript enums
main_image: "https://www.sohamkamani.com/assets/images/posts/enums-in-js/text-editor-completion.png"
description: "Enums in javascript: what they are, and how and when to use them"
comments: true
---

There are lots of times where enums are useful, and sometimes even nessecary.

Although javascript does not natively support enums, there are a lot of options when it comes to implementing enums using javascript.

<!-- more -->

# The naive way of implementing "enums"

Enums are used to represent a fixed number of possible values. If the number of possible values are 2 (as in the case with flags), you would just use a boolean.

For example, if you want to show a pop up in your application, but only in the summer, it would look something like this [(try it here)](https://runkit.com/sohamkamani/enums-in-js---boolean) :

```js
let isSummer = true // or, let isSummer = false

if(isSummer){
    showPopUp()
}
```

Now, lets look at the case where you have to change the theme of your application based on one of four seasons (summer, winter, autumn, and spring)

If you come from a background where enums were not used before, you have probably used the hard-coded string method to implement something like this [(try it here)](https://runkit.com/sohamkamani/enums-in-js---hard-coded-strings):

```js
let season = 'summer'
/*
or, 
let season = 'winter'
let season = 'spring'
let season = 'autumn'
*/

switch(season){
    case 'summer':
    // Do something for summer
    case 'winter':
    //Do something for winter
    case 'Spring':
    //Do something for spring
    case 'autumn':
    //Do something for autumn
}
```

If you look carefully, the problem with this kind of implementation is highlighted in the example above: it would fail in the case of "spring" since we have made a spelling error in our switch-case statement and accidentally used the title case "Spring" instead.

While this is easy to fix in the above example, life becomes much harder when you have to maintain an application with hundreds of code files using hard-coded strings everywhere.

# Enumerations with objects

A better way to implement enumerations is through objects. Consider this refactored version of the above example [(try it here)](https://runkit.com/sohamkamani/enums-in-js---object-enum):

```js
const seasons = {
    SUMMER: 'summer',
    WINTER: 'winter',
    SPRING: 'spring',
    AUTUMN: 'autumn'
}

let season = seasons.SPRING

if(!season){
    throw new Error('Season is not defined')
}

switch(season){
    case seasons.SUMMER:
    // Do something for summer
    case seasons.WINTER:
    //Do something for winter
    case seasons.SPRING:
    //Do something for spring
    case seasons.AUTUMN:
    //Do something for autumn
}
```

>Since it does not make a difference as to what values we use for the enums, we are using string names (like `'summer'` for `seasons.SUMMER`). This can provide a more usefull message while debugging, as compared to using numbers, which are the more conventional choice when using enums

The `seasons` objects is now an implementation of an enum with four possible values. By implementing this, we have improved our code in two ways:

1. **Consistency** : No more wondering about the exact value of the string for each season. Additionally, many text editors can now autocomplete these values for you (like this screenshot from teh VS code editor) :
    ![screenshot of editor autocomplete](/assets/images/posts/enums-in-js/text-editor-completion.png)
2. **Error handling** : Even if there are spelling errors, we now have a general way of gracefully handling them. This ensures that our program will fail in a predictable way


# Namespaced enums

We can also embed enums within each other, incase we need namespaces [(try it here)](https://runkit.com/sohamkamani/enums-in-js---namespaced-enums):

```js
const seasons = {
  SUMMER: {
    BEGINNING: "summer.beginning",
    ENDING: "summer.ending"
  },
  WINTER: "winter",
  SPRING: "spring",
  AUTUMN: "autumn"
};

let season = seasons.SUMMER.BEGINNING;

if (!season) {
  throw new Error("Season is not defined");
}

switch (season) {
  case seasons.SUMMER.BEGINNING:
  // Do something for summer beginning
  case seasons.SUMMER.ENDING:
  // Do something for summer ending
  case seasons.SUMMER:
  // This will work if season = seasons.SUMMER
  // Do something for summer (generic)
  case seasons.WINTER:
  //Do something for winter
  case seasons.SPRING:
  //Do something for spring
  case seasons.AUTUMN:
  //Do something for autumn
}
```

In this example, we have namespaced the summer season into two divisions (`BEGINNING` and `ENDING`), which we can now use are separate enum values.

An interesting fact, is that we can also use the original `seasons.SUMMER` enum value as well. Since object values are passed by reference, any two variables referencing `seasons.SUMMER` will be equal.

# When to use enums in javascript?

The reasons for using enums in javascript are the same as the reasons you should use it for any other programming language: *Use enums if there are a **definite** number of **fixed** values for any one variable*

In the end, using enums in javascript correctly will lead to better code that is more stable, easier to read and less error prone.