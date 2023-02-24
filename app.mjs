import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import './db.mjs';
import mongoose, { isObjectIdOrHexString } from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcryptjs'
import passport from 'passport';
import flash from 'express-flash'
import hbs from 'hbs'
import { Strategy as LocalStrategy} from 'passport-local'
import * as apis from './apis.mjs'
import { Server } from 'socket.io'
import { createServer } from "http";
import "dotenv/config.js"



const Events = mongoose.model('Entire');
const myWebsite = new Events();
const bouts = mongoose.model("bouts");
const massive = new bouts();
const areLive = mongoose.model("liveFight");
const we = new areLive();
const User = mongoose.model('User')
const UserInstance = new User();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended: false}));

app.use(flash())
app.use(session({
  secret : process.env.APIKEY,
  resave: false,
  saveUninitialized: false
}))
app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user,done) {
  done(null,user.id);
})
passport.deserializeUser(function(id,done){
  User.findById(id, function(err,user){
    done(err,user);
  });
});
passport.use(new LocalStrategy(function(username,password,done){
  User.findOne({username: username}, function(err, user){
    if (err){
      return done(err);
    }
    if (!user){
      return done(null,false, {message: 'Incorrect username.'});
    }
    bcrypt.compare(password, user.password, function (err,res){
      if (err) return done(err);
      if (res===false){
        return done(null,false,{message: 'Incorrect password.'});
      }
      return done(null,user);
    })
  })
}))
app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});
function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
function isLoggedOut(req,res,next) {
  if (req.isAuthenticated()) res.redirect('/');
  next();
}
app.get("/",isLoggedIn,(req,res)=>{
  res.render("index", {hello: "SUP"});
})
app.get("/Home",isLoggedIn,async function(req,res){
  let event = await Events.find({})
  let user = await User.find({email: req.user.email})
  let FinUser = user.map((users)=>{
    let container = {};
    container["username"]=req.user.username
    container["list"]=users.Fights;
    return container;
  });
  let liveList  = []
  for (let i =0;i<FinUser[0].list.length;i++){
    let temp = await bouts.find({FightId : FinUser[0].list[i]})
    let obj  = {"F1": temp[0].Fighter1, "F2": temp[0].Fighter2, "Order": temp[0].Order, "FID": temp[0].FightId};
    liveList.push(obj);
  }
  FinUser["display"] = liveList
  let FinEnv = event.map((events)=>{
    let container = {};
    container["EventId"]=events.EventId
    container["list"]=events.Name
    return container;
  });
  res.render('index', {FinUser: FinUser, FinEnv: FinEnv});
})

app.post("/Home",isLoggedIn,async function(req,res){
  var string = encodeURIComponent(req.body.custId);
  res.redirect('/fights?valid=' + string);
})
app.post("/Remove", isLoggedIn, async function(req,res){
  let discard = req.body.FightsToDiscard;
  if (typeof discard ==='string' || discard instanceof String){
    discard = [discard];
  }
  if (discard===undefined || discard===null || discard ===""){
  }else {
    for (let i = 0;i<discard.length;i++){
      await User.updateOne({username : req.user.username},{$pull: {Fights: discard[i]}});
      let print = await User.find({username : req.user.username})
    }
  }
  
  res.redirect('/Home')
})

app.get('/fights',isLoggedIn, async function(req, res){
  let bread = await Events.find({EventId: req.query.valid});
  let fightlist = bread[0].bouts
  let showList = [];

  for (let i =0;i<fightlist.length;i++){
    let fight = await bouts.find({FightId: fightlist[i]})
    let obj = {"F1": fight[0].Fighter1, "F2": fight[0].Fighter2, "Order": fight[0].Order, "FID": fight[0].FightId}
    showList.push(obj);
  }
  showList.sort((a,b) => a.Order - b.Order);
  let userList = await User.find({username: req.user.username});
  let storedFights = userList[0].Fights;
  showList = showList.filter((user)=>{
    if (storedFights.includes(user.FID)){
      return false;
    }
    return true;
  });
  res.render("damnit",{showList,showList});
})
app.post('/fights',isLoggedIn,async function(req,res){
  let fightsToAdd = Object.values(req.body);
  for (let i =0;i<fightsToAdd.length;i++){
    await User.updateOne({username: req.user.username},{$push: {Fights :fightsToAdd[i]}});
  }
  res.redirect('/Home');
})

app.get('/login',isLoggedOut,(req, res)=>{
  res.render("login")
})

app.post('/login',passport.authenticate('local',{
  successRedirect: '/Home',
  failureRedirect: '/login?error=true'
}));
app.get('/login?error=true', function(req,res){
  res.render("login");
})
app.get('/logout', function (req,res){
  req.logOut();
  res.redirect('/');
})

app.get('/register', isLoggedOut,function(req,res){
  res.render('register')
})
app.post('/register', isLoggedOut,async (req,res)=>{
  try {
    const exists = await User.exists({username: req.body.username});
    if (exists){
      res.redirect('/login');
      return;
    }
  } catch (e) {
  }
   bcrypt.genSalt(10, function (err,salt){
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, function(err, hash){
      if (err) return next(err)
      const newAdmin = new User({
        username: req.body.username,
        password: hash,
        email: req.body.password
      })
      newAdmin.save(function(err,doc){
        if (err){
          console.log("something went wrong");
        }else{
          console.log("All good");
        }
      });
      res.redirect('/login');
    })
  })
})
app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', function(socket){
  socket.on('UpdateOnDatabase', function(msg){
      socket.broadcast.emit('RefreshPage');
  });
});


let endpoint = ["Schedule/UFC/2022","Schedule/UFC/2023"]


setTimeout(()=>{
  apis.getData(endpoint[0]);
},10)

setTimeout(()=>{
  apis.getData(endpoint[1]);
},5000)


setInterval(()=>{
  apis.getData(endpoint[0]);
  apis.getData(endpoint[1]);
  io.on('connection', function(socket){
    socket.emit('UpdateOnDatabase');
  });
}, 302400000) // 3.5 day intervals



function FightTime(){
  
}
async function normal(){
  let nextFight = await areLive.find({});
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour12: false,
  });
  apis.change(date);
  if (nextFight.DateTime>date){
    setTimeOut(normal,30000);
  }else{
    setTimout(FightTime());
  }
}




app.listen(process.env.PORT || 3000);


