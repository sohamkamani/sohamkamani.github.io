---
layout: post
title: "Why you should always write tests for your code"
date: 2016-07-29T00:45:12.000Z
categories: testing tdd javascript
comments: true
---

Until I started my first job, I didn't even know what "writing tests" meant. Why would you want to write more code for your code?  

Even now, I come across all sorts of people who consider writing test cases a chore.

>My deadlines are too short to afford tests

or

>This project is too small to write tests for.

or

>This is just a side project... nothing serious. Why would I want to write tests for it?

Are some of the more common reasons you would find for not testing your code.  

If you observe closely, a common theme in all these reasons is the assumption that testing your code will take more of your time.

I have written this post to debunk that myth, and prove that testing actually saves a lot of your time, along with providing several other benefits.

## Tests are a one time investment in your code

Sure,tests can take some time to write initially, but they keep giving back returns over time. This is why I often refer to them as an investment. And what you are trading is your time.

Lets consider the cases of Derp and Derpina. They are both trying to build the exact same tool with the exact same features. The only difference is the approach they take.

__The first sprint__

Derp doesn't take the time out to write any tests for his code, and goes out and starts building his awesome tool. He takes about 2 hours to finish a prototype, and so far its looking pretty sweet.

Derpina decides to follow test driven development, and writes test cases in parallel with making her application. It takes her 2 additional hours to write test cases for the tool, and so far it looks the same as that of Derps'.

Now comes the time to test if the tool is working fine or not. Derp takes about 30 seconds to go through his tool (since its quite a small and simple one). Derpina on the other hand has the tests she wrote do it for her. They take about 1 second to execute and tell her that everything's working fine.

- Time spent by Derp : 2 hours 0 minutes 30 seconds    
- Time spent by Derpina : 4 hours 0 minutes 1 second

But wait! They see a small part of their code which can be refactored.

__Refactoring__

Derp refactors his code (10 minutes), and then tests it for any errors (30s). There is an error. He's not sure where exactly the error is in his application so he debugs and finds the source of the error (10 minutes), and fixes it (5 minutes).  
Derpina refactors her code (10 minutes), and runs her tests (1s). One of her tests fails and points to the source of the error. She then fixes it (5 minutes)

- Time spent per refactor by Derp : 25 minutes 30 seconds    
- Time spent per refactor by Derpina : 15 minutes 1 second
- Time spent by Derp : 2 hours 26 minutes 0 seconds    
- Time spent by Derpina : 4 hours 15 minutes 2 second

Once their code finally looks better. Derp and Derpina quickly realize that their entire app relies on an input given by the user that's supposed to be a whole number. They never considered the case where the person who is using the tool might enter a decimal, or a letter, or not enter anything at all!

__Edge cases__

Derp tests his code for all three of these edge cases (3 * 30s), finds out that one of the edge cases do not work as expected. He then refactors his code (25.5 minutes) and tests all cases again (3 * 30s)

Derpina modifies one of her tests (5 minutes) to account for all edge cases. She then finds similar results to that of Derp after running the tests (1s) and refactors her code (15m 1s), and runs her tests again (1s)

- Time spent by Derp : 2 hours 54 minutes 30 seconds
- Time spent by Derpina : 4 hours 35 minutes 5 seconds

__Adding a new Feature__

When the time finally comes to add a new feature, Derp seems to be a little slow in implementing it. This is because he is very careful to not break the other features of the tool while he is building the new feature. He finishes the new feature in 20 minutes, and tests his app against all cases (3 * 30 seconds).

Derpina on the other hand seems to be doing better. She *knows* that the tool will still work well because she has her tests running in the background telling her if anything is breaking. She manages to finish the feature in 10 minutes, with 5 minutes to write tests for the new feature as well.

## They give you confidence that your code will not fail

## They can act as documentation
