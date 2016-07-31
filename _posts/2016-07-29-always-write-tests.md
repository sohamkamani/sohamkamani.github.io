---
layout: post
title: "Why you should always write tests for your code"
date: 2016-07-29T00:45:12.000Z
categories: testing tdd javascript
comments: true
---
<style type="text/css">
.derp {
  color : #827717;
}

.derpina {
  color : #D84315;
}
</style>
>"If you don’t like testing your product, most likely your customers won’t like to test it either."  
 - Anonymous

Until I started my first job, I didn't even know what "writing tests" meant. Why would you want to write more code for your code?  

Even now, I come across all sorts of people who consider writing test cases a chore.

>My deadlines are too short to afford tests

or

>This project is too small to write tests for.

or

>This is just a side project... nothing serious. Why would I want to write tests for it?

are some of the more common reasons you would find for not testing your code.  

If you observe closely, a common theme in all these reasons is the assumption that testing your code will take more of your time.

I have written this post to debunk that myth, and prove that testing actually saves a lot of your time, along with providing several other benefits.

## Tests are a one time investment in your code

Sure,tests can take some time to write initially, but they keep giving back returns over time. This is why I often refer to them as an investment. And what you are getting returns on is your time.

Lets consider the cases of <span class="derp">Derp</span> and <span class="derpina">Derpina</span>. They are both trying to build the exact same tool with the exact same features. The only difference is the approach they take.

__The first sprint__

<span class="derp">Derp doesn't take the time out to write any tests for his code, and goes out and starts building his awesome tool. He takes about 2 hours to finish a prototype, and so far its looking pretty sweet.</span>

<span class="derpina">Derpina decides to follow test driven development, and writes test cases in parallel with making her application. It takes her an additional 30 minutes to write test cases for the tool, and so far it looks the same as that of Derps'.</span>

Now comes the time to test if the tool is working fine or not. Derp takes about 30 seconds to go through his tool (since its quite a small and simple one). Derpina on the other hand has the tests she wrote do it for her. They take about 1 second to execute and tell her that everything's working fine.

- <span class="derp">Time spent by Derp : 2 hours 0 minutes 30 seconds</span>    
- <span class="derpina">Time spent by Derpina : 2 hours 30 minutes 1 second</span>

But wait! They see a small part of their code which can be refactored.

__Refactoring__

<span class="derp">Derp refactors his code (10 minutes), and then tests it for any errors (30s). There is an error. He's not sure where exactly the error is in his application so he debugs and finds the source of the error (10 minutes), and fixes it (5 minutes).</span>  
<span class="derpina">Derpina refactors her code (10 minutes), and runs her tests (1s). One of her tests fails and points to the source of the error. She then fixes it (5 minutes)</span>

- <span class="derp">Time spent per refactor by Derp : 25 minutes 30 seconds</span>    
- <span class="derpina">Time spent per refactor by Derpina : 15 minutes 1 second</span>
- <span class="derp">Time spent by Derp : 2 hours 26 minutes 0 seconds</span>    
- <span class="derpina">Time spent by Derpina : 2 hours 45 minutes 2 second</span>

Once their code finally looks better. Derp and Derpina quickly realize that their entire app relies on an input given by the user that's supposed to be a whole number. They never considered the case where the person who is using the tool might enter a decimal, or a letter, or not enter anything at all!

__Edge cases__

<span class="derp">Derp tests his code for all three of these edge cases (3 * 30s), finds out that one of the edge cases do not work as expected. He then refactors his code (25.5 minutes) and tests all cases again (3 * 30s)</span>

<span class="derpina">Derpina modifies one of her tests (5 minutes) to account for all edge cases. She then finds similar results to that of Derp after running the tests (1s) and refactors her code (15m 1s), and runs her tests again (1s)</span>

- <span class="derp">Time spent by Derp : 2 hours 54 minutes 30 seconds</span>
- <span class="derpina">Time spent by Derpina : 3 hours 5 minutes 5 seconds</span>

__Adding a new Feature__

When the time finally comes to add a new feature, <span class="derp">Derp seems to be a little slow in implementing it. This is because he is very careful to not break the other features of the tool while he is building the new feature. He finishes the new feature in 30 minutes, and tests his app against all cases (3 * 30 seconds).</span>

<span class="derpina">Derpina on the other hand seems to be doing better. She *knows* that the tool will still work well because she has her tests running in the background telling her if anything is breaking. She manages to finish the feature in 15 minutes, with 5 minutes to write tests for the new feature as well.</span>

- <span class="derp">Time spent by Derp : 3 hours 26 minutes</span>
- <span class="derpina">Time spent by Derpina : 3 hours 25 minutes 5 seconds</span>

It seems that the tests that Derpina wrote are finally paying off, as we see that the total time spent by Derpina is less than that of Derps' after a few refactors and features added to the tool.

__TLDR__

Now, it's important to note that although _all the above numbers are made up_ (Obviously the development time, time to write tests and time to test the app manually vary immensely), there are a few things that stay constant everytime :

1. The time taken to run tests is always negligible as compared to the time taken to manually test the app.
2. If something in your app breaks, your tests will reduce the time spent in finding out where exactly your code is breaking.

As long as the above 2 conditions are true, the seemingly small time saved will compound over time and lead to _massive_ savings in the long run (or even in the slightly longer short run)

## Tests give you confidence that your code will not fail

Along with saving you time, tests also give you a certian degree of confidence that your code _will_ work. If you are writing a medium to large sized application, there is always more than one moving part. Just because you changed something doesn't mean it won't affect another part somewhere else.

A side effect of this is that you end up working faster. When you are constantly thinking about how one part of your code will affect another, it slows down your pace. With the proper tests in place, you get to try, fail, and retry inexpensively, which is always the better way to go in software development.

## You are forced to write better code

When you are hacking away on that weekend project, most of the code you write is throw-away spaghetti. Writing tests for this kind of code is extremely difficult.

This is why most programmers break up their code into small modules in an effort to make it more "testable". As it turns out, modularizing your code also makes your code more readable, reusable, and better in general.

## They can act as documentation

Consider this piece of code :

```js
const sinPlusCos = x => {
  if (isNaN(x) && x !== null) {
    return 'Invalid'
  }
  const xn = Number(x)
  return Math.sin(xn) + Math.cos(xn)
}
```

Can you figure out what it does? Even for edge cases? Let's take a look at some of the tests for it :

```js
describe('sinPlusCos', function() {

  it('Returns the sum of the sine and cosine of the input x', () => {
    expect(sinPlusCos(1)).to.equal(1.3817732906760363)
  })

  it('should return the sum even if the number is given as a string', () => {
    expect(sinPlusCos('1')).to.equal(1.3817732906760363)
  })

  it('Returns "Invalid" for a non-number value of x', () => {
    expect(sinPlusCos(null)).to.equal('Invalid')
    expect(sinPlusCos(undefined)).to.equal('Invalid')
    expect(sinPlusCos('abc')).to.equal('Invalid')
  })

});
```

After going through the tests you get a clearer picture of what exactly a piece of code is supposed to do. This is invaluable for developers who are going to be working on your code after you are gone. It is also extremely valuable for your future self, who would sometimes forget what it is that something you wrote is doing.

## It looks pretty

In the end, who doesn't like seeing something like this after working on a piece of code for a while :

![cover image](/assets/images/posts/always-write-tests/run-tests.png)

It makes you feel good, and can sometimes inspire you to write tests, just because you think its fun.

## Parting thoughts...

In the end, everything we do in software is done to make our lives easier. If testing made lives harder, it would have been abandoned ages ago, but it hasn't, because it does make our lives easier and saves our time.

I personally feel like it doesn't take nearly as much time and energy to write good test code, as opposed to writing good application code. But, the payoffs you get for writing tests is much better than writing "good" code.

Even good code can sometimes have bugs, but tests will make sure to never fail you.
