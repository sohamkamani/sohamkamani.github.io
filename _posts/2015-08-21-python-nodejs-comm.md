---
layout: post
title:  "How to communicate between Python and NodeJs 🐍"
date:   2015-08-21 18:45:12
categories: jekyll update
comments: true
---
<div dir="ltr" style="text-align: left;" trbidi="on">
NodeJs is amazing at a lot of things, but one area where it falls short is numerical and scientific computation. Python, on the other hand, is great for stuff like that, and libraries like numpy and scipy make scientific computing a breeze. Fortunately, we can utilize the power of numpy within our node application, by calling a python process to run in the background, do all the dirty work and give back the result.<br />
In this tutorial, we will be using the <code>child_process</code> standard library in nodeJs to spawn a python process which will compute the sum of all elements in an array, using numpy, and return back the result to our node program.<br />
If you want to skip the whole tutorial and just get your hands dirty, copy start.js and compute_input.py into the same directory, and run the command<br /><code>node start.js</code><br />on your terminal.
<!-- more -->
<br /><br />
Lets write the javascript first: <br />
<ol>
<li>Initialize all our variables
  {% highlight javascript %}
    var spawn = require('child_process').spawn,
    py    = spawn('python', ['compute_input.py']),
    data = [1,2,3,4,5,6,7,8,9],
    dataString = '';
  {% endhighlight %}

'py' is our spawned python process, which starts the script compute_input.py (which we will write later)
    </li>
<li>Define what we want to happen once we get data back from the python process:
{% highlight javascript %}
/*Here we are saying that every time our node application receives data from the python process output stream(on 'data'), we want to convert that received data into a string and append it to the overall dataString.*/
py.stdout.on('data', function(data){
  dataString += data.toString();
});

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});
{% endhighlight %}
<br />
    </li>
<li>Finally, dump our data on to the python process:
{% highlight javascript %}
/*We have to stringify the data first otherwise our python process wont recognize it*/
py.stdin.write(JSON.stringify(data));

py.stdin.end();
{% endhighlight %}
</li>
</ol>
In the end our javascript code would look like this:
<br />
{% highlight javascript %}
//start.js
var spawn = require('child_process').spawn,
    py    = spawn('python', ['compute_input.py']),
    data = [1,2,3,4,5,6,7,8,9],
    dataString = '';

py.stdout.on('data', function(data){
  dataString += data.toString();
});
py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});
py.stdin.write(JSON.stringify(data));
py.stdin.end();
{% endhighlight %}
<br />
Now we have to write compute_input.py which is relatively more straigtforward than our node application code<br />
{% highlight python %}
## compute_input.py

import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    np_lines = np.array(lines)

    #use numpys sum method to find sum of all elements in the array
    lines_sum = np.sum(np_lines)

    #return the sum to the output stream
    print lines_sum

#start process
if __name__ == '__main__':
    main()
{% endhighlight %}
And thats all there is to it. Just run start.js on your terminal to verify that the program runs correctly. You should get 45 as the output.<br />
<br />
Although for a simple summing operation you're better off sticking to nodeJs itself, for more complex operations(like maybe doing signal processing or finding the frequency spectrum on a series of numbers) its highly advisable to use numpy as the same functionality is just not there in nodeJs (at least not yet). Furthermore, computationally intensive operations will most likely freeze your program, which can be a disaster given the single threaded architecture of node, and they should be moved to their own separate child processes.<br />
<br />
</div>

### Related

- [Top 10 mistakes that python programmers make](https://www.toptal.com/python/top-10-mistakes-that-python-programmers-make)
- [How to work with NodeJS and not lose your mind](/blog/2015/08/22/understand_node_without_losing_your_mind/)
