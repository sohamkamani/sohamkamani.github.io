---
layout: post
title:  UUID4 Collision - How likely is it that there will be an identical pair of UUIDs?
date:   2016-10-02 08:45:12
categories: uuid uuid4 collision
comments: true
---

A __UUID__ (Universally unique identifier) is a 128 bit string which acts as an identifier for objects in the programming world. However, the uniqueness of this identifier is not perfectly universal. There is still a chance of 2 UUIDs somewhere in the world being the same.  

This post will go through the math and figure out how many of these random UUIDs must be generated in order for you to actually _worry_ about a collision.

$$ n_{c} = 2^{128} $$

Here , $$ n_c $$ is the total number of possible IDs that can be made.

$$ \bigcup_a^b $$

<script type="text/x-mathjax-config">
MathJax.Hub.Register.StartupHook("End Jax",function () {
  var BROWSER = MathJax.Hub.Browser;
  var jax = "SVG";
  if (BROWSER.isMSIE && BROWSER.hasMathPlayer) jax = "NativeMML";
  if (BROWSER.isFirefox) jax = "SVG";
  if (BROWSER.isSafari && BROWSER.versionAtLeast("5.0")) jax = "NativeMML";
  return MathJax.Hub.setRenderer(jax);
});
</script>
<script type="text/javascript"
    src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
