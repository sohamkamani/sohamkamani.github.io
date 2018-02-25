---
layout: post
title: How to make a responsive telegram bot 🔩
date: 2016-09-21T00:45:12.000Z
categories: telegram bot javascript nodejs
main_image: "https://www.sohamkamani.com/assets/images/posts/telegram-bot/header.png"
comments: true
---

>This tutorial will go through a straightforward set of steps to get a responsive telegram bot up and running from scratch

![header](/assets/images/posts/telegram-bot/header.png)

I spent a considerable amount of time figuring out how to make a functional telegram bot. I mean sure, the [official introduction](https://core.telegram.org/bots) is good, but theres a lot of stuff about what bots are, and a few scattered instructions about the API, but not enough of structure for a beginner to get up and running quickly.  

So, heres how to make a responsive telegram bot with the least amount of hassle :

<!-- more -->

### Set up your bot

You don't need to write any code for this. In fact, you don't even need your computer! Go to the telegram app on your phone and...

1. Search for the "botfather" telegram bot (he's the one that'll assist you with creating and managing your bot)
    ![s0](/assets/images/posts/telegram-bot/sc-0.png)

2. Type `/help` to see all possible commands the botfather can handle
    ![s1](/assets/images/posts/telegram-bot/sc-1.png)

3. Click on or type `/newbot` to create a new bot.  
    ![s2](/assets/images/posts/telegram-bot/sc-2.png)
    Follow instructions and make a new name for your bot. If you are making a bot just for experimentation, it can be useful to namespace your bot by placing your name before it in its username, since it has to be a unique name. Although, its screen name can be whatever you like.  
    I have chosen "Marco Polo Bot" as the screen name and "sohams_marco_polo_bot" as its username.

4. Congratulations! You have created your first bot. You should see a new API token generated for it (for example, in the previous picture, you can see my newly generated token is `270485614:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0`). Now you can search for your newly created bot on telegram :
    ![s3](/assets/images/posts/telegram-bot/sc-3.png)

5. Go ahead and start chatting with your bot!
    ![s4](/assets/images/posts/telegram-bot/sc-4.png)
    Well, that's pretty disappointing. Our bot seems to be stupid, in the sense that it can't really reply or say anything back. Let's take care of that by building our bot server which runs on the back end.

### Set up you bot server

Every time you message a bot, it forwards your message in the form of an API call to a server. This server is what processes and responds to all the messages you send to the bot.

There are two ways we can go about receiving updates whenever someone sends messages to our bot :

1. Long polling : Periodically scan for any messages that may have appeared. Not recommended.
2. Webhooks : Have the bot call an API whenever it receives a message. Much faster and more responsive.

We are going to go with webhooks for this tutorial. Each webhook is called with an [update object](https://core.telegram.org/bots/api#update). Lets create our server to handle this update.

We will be creating our server using [node.js](https://nodejs.org/en/), but you can use whatever suits you to make your server. Once you have node and npm installed :

First, initialize your project  

```sh
## Create a new directory and enter it
mkdir my-telegram-bot
cd my-telegram-bot

## Initialize your npm project
npm init
```

After following the instructions, you will end up with a `package.json` file.

Next, install you dependencies by running :

```sh
npm install --save express axios body-parser
```

- `express` is our application server
- `axios` is an http client
- `body-parser` will help us parse the response body received from each request

Make a new file `index.js` :

```js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const axios = require('axios')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post('/new-message', function(req, res) {
  const {message} = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  if (!message || message.text.toLowerCase().indexOf('marco') <0) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end()
  }

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios.post('https://api.telegram.org/bot270485614:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0/sendMessage', {
    chat_id: message.chat.id,
    text: 'Polo!!'
  })
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })

});

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!');
});
```

You can run this server on your local machine by running `node index.js`

If all goes well, you should see the message "Telegram app listening on port 3000!" printed on your console.

But, this is not enough. The bot cannot call an API if it is running on your local machine. It needs a public domain name. This means we have to deploy our application.

### Deploy your service

You can deploy your server any way you want, but I find it really quick and easy to use a service called [now](https://zeit.co/now).

Install now on your system :

```
npm install -g now
```

Add a start script to your `package.json` file.

My original `package.json` file looks like :

```js
{
  "name": "telegram-bot",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Soham Kamani <sohamkamani@gmail.com> (http://sohamkamani.com)",
  "license": "ISC"
}
```

Add a start script, to get :

```
{
  "name": "telegram-bot",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start" : "node index.js"
  },
  "author": "Soham Kamani <sohamkamani@gmail.com> (http://sohamkamani.com)",
  "license": "ISC"
}
```

Once you've added the script, run the command :

```sh
now
```

(remember to run in in the root of your project folder, wherever the `package.json` file is located)

If this is your first time using "now", you will see some instructions for signing in, but after that you should see something like this :

![now](/assets/images/posts/telegram-bot/now-dep.png)

Great! This means your server is deployed on `https://telegram-bot-zztjfeqtga.now.sh` (or whatever link you see instead), and your API would be present on `https://telegram-bot-zztjfeqtga.now.sh/new-message` (as defined in `index.js`)

Now, all we need to do is let telegram know that our bot has to talk to this url whenver it receives any message. We do this through the telegram API. Enter this in your terminal :

```sh
curl -F "url=https://telegram-bot-zztjfeqtga.now.sh/new-message"  https://api.telegram.org/bot<your_api_token>/setWebhook
```

...and you're pretty much done! Try chatting with your newly made bot and see what happens!

![result](/assets/images/posts/telegram-bot/result.jpg)
