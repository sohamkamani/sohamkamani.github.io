---
layout: post
title: Why we should stop using GIFs 🏭
date: 2016-04-09T08:45:12.000Z
categories: gif web html
comments: true
---

GIFs have been around for as long as I can remember, and today they're as popular as ever. For an image format so popular, GIFs are horribly outdated and inefficient, and they should die. Hopefully by the end of this post I'll have convinced you to fight the plague that is the GIF image format.
<video autoplay loop>
<source src="/assets/images/posts/no-gifs/kill.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

I could go on and on about how we should get rid of GIFs, but lets take a moment to find out why I feel so strongly about this.
<!-- more -->
Already know why GIFs suck and want to know about a solution? [Go here](#solution)  

## The origin and intent of the GIF
Ironically, even though I am calling GIFs inefficient today, the reason they got so popular back in the day (1987) is _because_ they were efficient. GIFs used a form of image compression (called LZW compression) which allowed for even large images to be downloaded in a short time, with slow bandwidth. Later, basic animation was added to the specs, which allowed for multiple images to be painted one after the other with a certain time delay. margin: auto; Turns out, this compression technique, coupled with animation, and the addition of transparency made GIFs particularly useful for displaying logos and simple animated icons with ~10 frames of images, like the ones you see on the [official Space Jam website](http://www.warnerbros.com/archive/spacejam/movie/cmp/tunes/tunesframes.html).<br>**Don't get me wrong, GIFs were pretty amazing at the time for the use case they were designed for.**

<video autoplay loop>   <source src="/assets/images/posts/no-gifs/awesome.webm" type="video/webm">  Your browser does not support the video tag. </video><br>

## GIFs today
Let's see how the many features that made GIFs attractive, compare with their modern day counter parts :

#### Image compression
The GIF was known for its lossless compression, but has ever since been surpassed by the PNG format, a non patented improvement over the GIF. The PNG format is now the most used lossless format on the web.<br>We also have the popular JPEG image format, which is lossy. This means that The quality of the image is compromised in some localized areas, but in return lead to massive gains in compression. This lossy format is highly optimized for photographs which have varying degrees of detail throughout the picture.

#### Color and transparency
You might have noticed that many GIFs depicting photographs and complex colored images seem a little jarred. This is because the GIF image standard only has support for 256 colors (an 8 bit channel) along with a binary channel for transparency (this means theres no translucency, either a pixel is completely transparent, or it's not).  
The PNG image format on the other hand has support for 16.9 million colors (24 bit color channel) with an additional 8 bit channel for transparency (which means each pixel can have 256 degrees of transparency).
![png-demo](/assets/images/posts/no-gifs/png-demo.png)  
In this PNG image, we can see that the edges of the dice are not sharp (they are gradually tapered off). Here, the blur near the edges, and the background, show different degrees of transparency (try pasting the image on some other background, the edges will blur into it), which is not possible with a GIF.  
The JPEG standard also has support for 16.9 million colors, albeit without transparency, since JPEG is meant to be used for photography, and not graphic design.

#### Animation
<video autoplay loop>   <source src="/assets/images/posts/no-gifs/please-no.webm" type="video/webm">  Your browser does not support the video tag. </video><br>
Animation is undoubtedly the reason GIFs are so popular today, and the reason I refer to them as :

## The Plague

Today, we see GIFs almost everywhere : in blogs, funny content sites and twitter posts. So its quite easy to oversee how horribly inefficient they are.

>What do you mean inefficient?

Well, for starters, try downloading [this video](/assets/images/posts/no-gifs/colors.mp4), and its equivalent [GIF](/assets/images/posts/no-gifs/colors.gif).

As youll see for the GIF, the resolution is much lesser, the colors are much less vibrant, and to top it off, the video is just 2.4MB, while the GIF weighs in at a whopping 14MB.

>But why?

***The wonder of video compression*** : If you take two successive frames of any video, you'll see that most of the time, there is really not much of a difference between each successive frame, maybe a few pixels change color, while others move around a bit. Modern day video formats *only take these small differences into consideration* so they don't have to store information about the *whole* picture of *each* frame separately. This leads to **massive** gains in terms of compression, which enables us to store an entire 720p movie in around 700MB (something many of us take for granted 😉).  

As it turns out, the way GIFs store this information is far from ideal : while each frame of a video or animation is compressed on its own, the inter-frame information is not taken into consideration, which means that the GIF has to store *all* the information about *each* frame. This is why, even though our GIF is of much lower quality than our video, the file size is still much larger (and this is an understatement : if you directly convert the above video to a GIF without reducing its resolution, the total file size gets close to ~40MB).

 Even though GIFs had this glaring problem, they still rapidly rose in popularity because of sites like [9gag](http://9gag.com), [tumblr](https://www.tumblr.com/dashboard), and [reddit](https://www.reddit.com/r/funny) relying on GIFs for their content.

>But what are my alternatives? I still want to show looping animated images on my site... they're pretty cool

And you should! Luckily there is an easy solution :
<span id="solution"></span>

### HTML5 Video
You can get all the awesomeness that GIFs provide and more with the HTML5 `<video>` element.

So what was before :

```html
<img src="my-funny-animation.gif"/>
```
would now become

```html
<video autoplay loop>
  <source src="my-funny-and-efficient-video.mp4" type="video/mp4">
  <source src="my-funny-and-efficient-video.webm" type="video/webm">
</video>
```

The `autoplay` and `loop` attributes ensure that the video play automatically and keeps looping when its finished, to exactly mimic the look and feel of a GIF.

**In case you haven't noticed yet, all the animated images used in this post are actually HTML5 videos (try right clicking on them)**

>But I have lots of GIFs already... how can I convert them?

There are many [online tools](https://cloudconvert.com/gif-to-webm) to do just this, but they are not suitable for converting any more than a handfull of GIFs. For that, there is a simple and very powerful tool called [ffmpeg](https://www.ffmpeg.org/). Now converting a GIF to a video can be done using the command line :

```sh
ffmpeg -i abc.gif abc.mp4
```

Its also quite a delight to see the change in file size once your GIF gets converted into a video

>But I want to support IE6, and GIFs are supported even by legacy browsers

In cases where you absolutely *have* to support older browsers as well, it's advisable to use GIFs as a *fallback*

```html
<video autoplay loop>
  <source src="my-funny-and-efficient-video.mp4" type="video/mp4">
  <source src="my-funny-and-efficient-video.webm" type="video/webm">
  <img src="my-funny-fallback.gif"/>
</video>
```

Here, the GIF will only be rendered if there is no support for HTML5 video in your browser.

## Final Thoughts

>Internet speed has increased in general, is it worth doing all this work for a few megabytes here and there?

Almost always. Sure, one or two GIFs on your site *may* not make much of a difference, but when you have a blog or a funny content site with many GIFs loading one after the other, that difference can *really* add up. Additionally, in a world where users are increasingly shifting towards mobile devices with limited bandwidth, making them download almost 10 times the volume of content for no good reason almost seems like a crime.

There are already websites doing this :  

- The [gifv](http://blog.imgur.com/2014/10/09/introducing-gifv/) project from imgur, one of the largest GIF hosting sites, aims at converting all GIFs to HTML5 video.
- Many posts on reddit are now also HTML5 videos, instead of GIFs

So now that you know why GIFs are so horrible, let's get rid of them once and for all for a *better* and more *progressive* web.
