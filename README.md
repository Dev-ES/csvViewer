# csvViewer

IndexedDB && Offline application - POC

This POC focuses on indexedDB performance handling big datasets


##  Browser and cli testing

If you want to run and test the code, you will need ***Node.js*** and ***npm***. Also, It will require ***grunt*** installed on the test environment.

Download this repository and uncompress to a given directory, lets assume: ***/var/html/www/csvViewer/***


#### Step 1

Open and edit the file Gruntfile.js. Look for the following lines:

If you want to test on **browser**, please set runInBackground as false in Gruntfile.js

    runInBackground: false

If you want to test on **terminal**, please set runInBackground as true in Gruntfile.js

    runInBackground: true

#### Step 2

Install grunt (if you don't have it installed):

    $ npm install -g grunt-cli

Now, on terminal, navigate to the project directory:

    $ cd /var/html/www/csvViewer/


Now start npm

	$ npm init


Install dependencies:

    $ npm install grunt-contrib-qunit --save-dev

    $ npm install grunt-http-server

#### Step 3

###### Terminal

Now , if you want to run the test on **terminal** (please see Step 1), type on terminal:

    $ grunt test


###### Browser

Now , if you want to run the test on **browser** (please see Step 1), type on terminal:

    $ grunt livetest

Then open the browser and reach the following address: 

http://localhost:8282/test/t.html