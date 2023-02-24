# Crunchtime 

## Overview

App that notifies users when key moments in games/fight cards are about to happen. Modern sport watchers have so many sports that they follow and simply don't have the time to follow the best games live. However, these sport fans want to watch their favorite players and teams in key moments. For instnce a fight card can have numerous fights, but a fan may only want to watch certain fights. This app notifies them when their favorite fight is about to start so they can tune in, watch their favorite fights live. 


## Data Model

Each user will have a login and that contains a unique ID and password. They will then have two arrays associated with the account. The first is a vanilla array with a list of sports that they follow. They will also have an event list. This is an array of objects. The first field in the object is the corresponding sport object that specificies the type of sport object they want to watch. 
The point of the first array is so that users get a list of possible events that they can follow. For instance, if users want to follow MMA then on their "Home" page they will get to choose from a list of events that they can follow.
The array of objects is the events. these have the name of the event and depending on the sport different data fields. 

Types of sport objects and their functionalities: 
There will be one only sport on offer (will add others depending on the time taken to add these and negotiations with API's to get data). The first is mixed martial arts. There are two main orginsations that users can follow - Bellator and the UFC. If users choose to follow an MMA (mixed martial arts) event then the event object with contain a list of fights (in chronological time order) with boolean values associated with those fights. The program will check when the fight before a fight that is marked as true finishes. When this is satisfied it will push a notification to the user telling the user that their fight is about to start. 

Note: still trying to contact a API that is willing to work with me...
Ideal API data description. 

An Example User:

```javascript
{
  username: "J_SUPHA",
  hash: // a password hash,
  SportList: // list of Sport events to show
  EventList: //list of event objects that user has subscribed to
}
```

An example of universal API object after middleware has sifted through raw API Call : Raw API can be found at https://developer.sportradar.com/docs/read/combat_sports/MMA_v2. What we have is a total website object that contains all of the events data that is needed. This saves us from having to call the API mulitple times because calling the API mulitple times for different accounts is expensive. Instead API is refreshed every 2 minutes and is cascaded through the accounts. Updating the accounts accordingly.  

```javascript
{
  WebSiteSports: //all the sports that are needed. this will initialize the API call when react clock live passes 3 minutes
  SavedEvents: //aggragtes all the saved events so that all the saved events are filtered accordingly
}
```
## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/list/create - login and create account page

![list create](documentation/AccountLogin.jpg)

/list - General page for all users 

![list](documentation/GeneralPage.jpg)

## Site map

Site map can be accessed [here](https://docs.google.com/drawings/d/1goKXiTKbNzUrs0k5FXc4DCFcWHnvtnLQqBxo2MQXxOU/edit).

## User Stories or Use Cases

[user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can select which sports I am interested in
4. as a user, I can view all the events that related to that sport
5. as a user, I can select an event that I am interested in 
6. as a user, I can select which fights I am interested in and will get notifications of when that fight starts
7. as a user, I can select when I want Crunchtime to notify me during a game


## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
* (2 points) Web-Push
    * used to push notifications into fights. Implementation will be complicated have assigned 3 points
* (5 points) Fetch and API
   * used to call and get data from 3rd party API

13 points total out of 8 required points

## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. https://github.com/axios/axios 
3. https://www.section.io/engineering-education/push-notification-in-nodejs-using-service-worker/ 

Reasearch into push notifications:
```npm install -save body-parser, web-push```
Need to generate VAPID keys (Voluntary Application Server ID)-
allows us to send push messages without having to setup the entire 
service. VAPID keys occur in pairs - private and public. 
Tried and started to inegrate is

```./node_modules/.bin/wed-push generate-vapid-keys``` Store 
VAPID keys in variables and use webpush.setVapidDetails()
Creating subscribe:
app.post("/subscribe",(req,res)=>{
  //get push subscription object from the request
  const sub = req.body

  const payload = JSON.stringify({fight: currentFight});
  //finally pass object into sendnotification 
  webpush.sendNotification(sub,payload).catch(err=>console.log(err))
})
That is the basics of the server -
now on the client side we need three components
frontend code/client and service worker
index is the html of the payload 
service worker is script run by the browser separate from the web page 
in set up VAPID key convert public key to a 
Uint8Array to pass into the subscribe call
Then add event listener to follow. 
Problem with WEb-push was that it messed with expresss in unexpected ways
especially with high volume of web-pushes needed during fight simulation
d
```EXAMPLE OF USING Fetch```
Still trying to figure out how to use website API efficiently - don't want to accidently
use too many calls cause that will be expensive 
app.get("/", async (req, res, next) => {
  try {
    const response = await axiosInstance.get("/getGameSummaries");
    console.log(response.data.result);

    //You need To send data from using send method
    res.status(200).send(response.data.result);

    //Or you can use json method to send the data
    res.status(200).json(response.data.result);

  } catch (err) {
    res.status(400).send(err);
  }
});
axios.get("https://sportradar.com/?lang=en-us&api_key=your_api_key")
    .then(response => {this.results = response.data.results})
  }
});
Had huge problems with the API. Firstly axios didn't work as well as expected to I switched to fetch instead. And then the original API that I intented to use sportrac.com gave inaccurate data. They left cancelled Fights on the API. Had to switch to sportsdata.io.
It was tough to integrate and switch. Very time consuming hence the high rating in points. Needed to understadn how to call the API correctly. 



Passport JS
passport.authenticate() is middle ware which
will authenticate the request. when authentication sucess the 
req.user property is set to the authenicated user
session is established, and the next function in the 
stack is called.

Strategies - are responsible for authenticating requests 
Mechanisms define how to encode a credential, password 


USERNAME/PASSWORD passport-local package 

passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
});
