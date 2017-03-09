---
layout: post
title: How to sync your data between Google sheets and Firebase 🗄
date:   2017-03-09 01:45:12
categories: google sheets firebase data sync
comments: true
---

Google sheets provides an excellent interface for regular users to view and modify data. Wouldnt it be great if we could use this data to power our Firebase application? Well, as it turns out, we can.  

In this tutorial, we will be using google scripts, to sync up the data in google sheets and store it in our firebase real time database.

<!-- more -->

### Step 1 : Initial set up

Firstly, set up your database in Firebase : 

![set up database](/assets/images/posts/firebase-google-sync/gfb_setup-db.png)

Then, take a note of your database URL. Mine is `https://hello-firebase-f2g16.firebaseio.com/`

Next, make a new google sheet, and fill in some data :

![set up database](/assets/images/posts/firebase-google-sync/gfb_excel-data.png)


### Step 2 : Get your database secret

Go into your firebase console > Project settings > Service accounts > Database secrets

![get db secret](/assets/images/posts/firebase-google-sync/gfb_db-secret.png)

Click on "show" to reveal your secret. Let's assume mine is `supersecretauthtoken`.

>Note : Using an auth token for authentication in firebase is now __deprecated__ in favour of using the firebase SDK. Since we are going to use google scripts, there is no way we can use the firebase SDK (yet), and so, we fallbasck to using the auth token.

### Step 3 : Add the google script

On the google sheet, go to Tools > Script Editor  
This will take you to your google scripts console.

Open a new script file, and add a new script :

```js
//Add in your database secret
var secret = 'supersecretauthtoken'


function getFirebaseUrl(jsonPath) {
  /*
  We then make a URL builder
  This takes in a path, and
  returns a URL that updates the data in that path
  */
  return 'https://hello-firebase-f2g16.firebaseio.com/' + jsonPath + '.json?auth=' + secret
}

function syncMasterSheet(excelData) {
  /*
  We make a PUT (update) request,
  and send a JSON payload
  More info on the REST API here : https://firebase.google.com/docs/database/rest/start
  */
  var options = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(excelData)
  };
  var fireBaseUrl = getFirebaseUrl('masterSheet')

  /*
  We use the UrlFetchApp google scripts module
  More info on this here : https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
  */
  UrlFetchApp.fetch(fireBaseUrl, options);
}

function startSync() {
  //Get the currently active sheet
  var sheet = SpreadsheetApp.getActiveSheet();
  //Get the number of rows and columns which contain some content
  var [rows, columns] = [sheet.getLastRow(), sheet.getLastColumn()];
  //Get the data contained in those rows and columns as a 2 dimensional array
  var data = sheet.getRange(1, 1, rows, columns).getValues();

  //Use the syncMasterSheet function defined before to push this data to the "masterSheet" key in the firebase database
  syncMasterSheet(data);
}
```

Now, `startSync` is the main function that we are going to attach to our sheet.

### Step 4 : Bind the script to a UI element on the sheet

Now that we have made our script to get and push our data to firebase, we need a way to trigger it from our sheet.

First, lets make a button, which is what we are going to click to get the script running. Go to `Insert > Drawing` on your sheet. Draw a simple rectangle and fill in some text, like "sync" :

![draw object picture](/assets/images/posts/firebase-google-sync/gfb_insert-drawing.png)

Position this newly created drawing wherever you like, and then right click and click on the small arrow on the top right. Select the "Assign script" option :

![assign script](/assets/images/posts/firebase-google-sync/gfb_assign-script.png)

Fill in the name of the function you just wrote in google scripts. In this case, the name of the main function we wrote is `startSync`.

### Verify

Thats all there is to it 😄.  
To verify that everything is working, click on the "Sync" button you just made. You should get a message telling you that the script has started running, and again when the script has finished.

When you check your firebase realtime database, you should now see all the data populated there :

![final result](/assets/images/posts/firebase-google-sync/gfb_db-result.png)

Everytime you change the data in your google sheet, and click on "sync", you should see the data appear in the database. Neat!