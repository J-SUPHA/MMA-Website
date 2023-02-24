
import mongoose from 'mongoose'
// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
  
 const fn = path.join(__dirname, 'config.json');
 const minec = fs.readFileSync(fn);
 const conf = JSON.parse(minec);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/js10193';
}
const UserSchema = new mongoose.Schema({
  username: { type:String, required:true },
  email: { type:String, unique:true },
  password: { type:String, required:true },
  Fights:  [{ type : String}]
});
const nextEvent = new mongoose.Schema({
  EventId:String,
  Name:String,
  DateTime: Number,
  Status: String,
  Active: Boolean,
  bouts: [{type : String}]
})
const Events = new mongoose.Schema({
  EventId:String,
  Name:String,
  DateTime: Number,
  Status: String,
  Active: Boolean,
  bouts: [{type : String}]
});
const bouts = new mongoose.Schema({
    FightId: String,
    Fighter1: String,
    Fighter2: String,
    Order: Number,
    WinnerStatus: Boolean
})
const User = mongoose.model("User", UserSchema);
const Entire = mongoose.model("Entire", Events);
const Fight = mongoose.model("bouts",bouts)
const live = mongoose.model("liveFight",nextEvent)
mongoose.connect(dbconf);