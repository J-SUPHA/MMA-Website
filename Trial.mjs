
import fetch from 'node-fetch';
import './db.mjs';
import mongoose from 'mongoose'
import e from 'express';
import fs from 'fs';
import path from 'path';
import url from 'url';
import 'dotenv/config.js'


console.log(typeof process.env.APIKEY);
// function mi(mng,obj){
//   mng.FightId = obj.FightId;
//   mng.Fighter1 = obj.Fighter1;
//   mng.Fighter2 = obj.Fighter2;
//   mng.WinnerStatus = obj.WinnerStatus;
//   mng.Order = obj.Order
// }

// function OI(mng,obj){
//   mng.EventId = obj.EventId;
//   mng.Name = obj.Name;
//   mng.DateTime = obj.DateTime;
//   mng.Status = obj.Status;
//   mng.Active = obj.Active;
// }

// let endpoint = ["Schedule/UFC/2022","Schedule/UFC/2023","Event/"]



// (Events.find((err,docs)=>{
//   if (err){
//     console.log(err)
//   }else{
//     console.log(docs);
//   }
// }));



// const date = new Date().toLocaleString('en-US', {
//   timeZone: 'America/Los_Angeles',
//   hour12: false,
// });

// function swap(one, two, l){
//   let temp = l[two];
//   l[two] = l[one];
//   l[one]=temp
// }
// function prune(data){
//   let d = date.split(",");
//   let mini = d[0].split("/");
//   swap(0,1,mini);
//   swap(0,2,mini);
//   d[1]=d[1].trim();
//   d[1]=  d[1].replace(/\D/g, '');
//   let dawg = [...mini,d[1]]
//   let steptwo = dawg.join("");
//   let final = parseInt(steptwo)
//   for (let i = 0;i<data.length;i++){
//     data[i].DateTime = data[i].DateTime.replace(/\D/g, '');
//     data[i].DateTime = parseInt(data[i].DateTime);
//     delete data[i].ShortName
//     delete data[i].Day
//     delete data[i].LeagueId
//     delete data[i].Season
//     data[i].bouts = [];
//   }
//   data = data.filter(obj =>{return obj.DateTime>final});
//   return data;
// }

// async function Save_n_Add(brand,father, MMA){
//   bouts.exists({FightId:MMA.FightId}, function(err,doc){
//     if (err){
//       console.log(err);
//     }if (doc===null){
//       MMA.save(function (err,doc){
//         if (err){
//           console.log(err)
//         }else{
//           //console.log(MMA);
//         }
//       })
//       Events.updateOne(
//         { EventId: father.EventId }, 
//         { $push: { bouts: MMA.FightId} }, function(err, docs){
//           if (err){
//             console.log(err.message);
//           }else{
//             console.log("doc reads as "+ JSON.stringify(docs));
//           }
//         });
//     }
//   })
//   brand.push(MMA.FightId);
// }

// async function checknsave(object){
//   await Events.exists({EventId: object.EventId}, function (err,doc){
//     if (err){
//       console.log("err");
//     }
//     if (doc===null){
//       object.save(function(err,doc){
//         if (err){
//           console.log(err);
//         }else{
//           console.log("saved");
//         }
//       });
//       console.log("The save was completed");
//     }
//     getFights(object.EventId, object)
//   })
// }
// async function search(Stuff){
//  const promise = await Events.exists({EventId: Stuff.EventId})
//  return promise;
// }

// function getFights(ID, father,url = "https://api.sportsdata.io/v3/mma/scores/json/Event/", data = {}) {
//   url = url +ID;
//   fetch(url,{
//     method: 'GET',
//     headers: {
//       "Ocp-Apim-Subscription-Key": "94d343b80e574457b91a0c338a67109e",
//       "Content-Type": "application/json"
//     },
//   }).then((response)=> response.json()).then(function(data){
//     let brand = [];
//     data.Fights.forEach(obj =>{
//       let add = {}
//       if (obj.Fighters[0]!==undefined){
//         add["FightId"] = obj.FightId;
//         add["Fighter1"] = obj.Fighters[0].FirstName + " " + obj.Fighters[0].LastName;
//         add["Fighter2"] = obj.Fighters[1].FirstName + " " + obj.Fighters[1].LastName;
//         add["WinnerStatus"] = obj.WinnerId;
//         add["Order"] = obj.Order;
//         const MMA = new bouts();
//         mi(MMA,add);
//         Save_n_Add(brand,father, MMA);
//       }
//       }
//     );
//   }
//  )
// }
//  function getData(ep ,url = 'https://api.sportsdata.io/v3/mma/scores/json/', data = {}) {
//    url = url +ep;
//   fetch(url,{
//     method: 'GET',
//     headers: {
//       "Ocp-Apim-Subscription-Key": "94d343b80e574457b91a0c338a67109e",
//       "Content-Type": "application/json"
//     },
//   }).then((response)=> response.json()).then(function(data){
//     let stuff = prune(data);
//     stuff.forEach(obj => {
//       const myWebsite = new Events();
//       OI(myWebsite,obj);
//       checknsave(myWebsite);
//     })
//   }
//  )}


//getData(endpoint[0]);



// const trial = Web.exists({EventId:869},function(err, doc){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Result :", doc) // false
//   }
// })
// const number = Web.count({}, function( err, count){
//   console.log( "Number of users:", count );
// })
//console.log(number);






//console.log(lol);
//prune();
//console.log("Here is the gap that exists");
//console.log(lol);
//saveThings();
  
const Events = mongoose.model('Entire');
const myWebsite = new Events();
const bouts = mongoose.model("bouts");
const massive = new bouts();
const areLive = mongoose.model("liveFight");
const we = new areLive();
const User = mongoose.model('User');


// async function FightTime(){
//   let curfight = await areLive.find({});
//   let List = curfight[0].bouts;
//   List.forEach((user)=>{console.log(user)});
//   let x = []
//   for (let i = 0;i<List.length;i++){
//     let temp = await bouts.find({FightId: List[i]});
//     let obj = {"F1": temp[0].Fighter1, "F2": temp[0].Fighter2, "Order": temp[0].Order, "FID": temp[0].FightId}
//     x.push(obj);
//   }
//   x.sort((a,b) => b.Order - a.Order);
//   console.log(x);
  
// }
// async function normal(){
//   let nextFight = await areLive.find({});
//   const date = new Date().toLocaleString('en-US', {
//     timeZone: 'America/Los_Angeles',
//     hour12: false,
//   });
//   apis.change(date);
//   if (nextFight.DateTime>date){
//     setTimeOut(normal,2000);
//   }else{
//     setTimout(FightTime(),2000);
//   }
// }



// const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// function getData(ep ,url = 'https://api.sportsdata.io/v3/mma/scores/json/', data = {}) {
  
//    url = url +ep;
//    const fn = path.join(__dirname, 'config.json');
//    const mine = fs.readFileSync(fn);

//  // our configuration file will be in json, so parse it and set the
//  // conenction string appropriately!
//   const conf = JSON.parse(mine);
//   fetch(url,{
//     method: 'GET',
//     headers: {
//       "Ocp-Apim-Subscription-Key": conf.APIKEY ,
//       "Content-Type": "application/json"
//     },
//   }).then((response)=> response.json()).then(function(data){
//     console.log(data);
//    })
//    //findAndPushNext();
//   }


//   let endpoint = ["Schedule/UFC/2022","Schedule/UFC/2023"]

// console.log(getData(endpoint[0]));



// FightTime();




