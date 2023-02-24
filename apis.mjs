
import fetch from 'node-fetch';
import './db.mjs';
import mongoose from 'mongoose'
import "dotenv/config.js"

const Events = mongoose.model('Entire');
const myWebsite = new Events();
const bouts = mongoose.model("bouts");
const massive = new bouts();
const areLive = mongoose.model("liveFight");
const User = mongoose.model('User')
const UserInstance = new User();

export const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour12: false,
  });

function OI(mng,obj){
    mng.EventId = obj.EventId;
    mng.Name = obj.Name;
    mng.DateTime = obj.DateTime;
    mng.Status = obj.Status;
    mng.Active = obj.Active;
  }
function LOI(mng,obj){
    mng.EventId = obj.EventId;
    mng.Name = obj.Name;
    mng.DateTime = obj.DateTime;
    mng.Status = obj.Status;
    mng.Active = obj.Active;
    mng.bouts = obj.bouts;
  }
function mi(mng,obj){
    mng.FightId = obj.FightId;
    mng.Fighter1 = obj.Fighter1;
    mng.Fighter2 = obj.Fighter2;
    mng.WinnerStatus = obj.WinnerStatus;
    mng.Order = obj.Order
  }
function swap(one, two, l){
    let temp = l[two];
    l[two] = l[one];
    l[one]=temp
}
  function check(s){
    if (s==='1' ||s==='2' ||s==='3' ||s==='4' ||s==='5' ||s==='6' ||s==='7' ||s==='8' ||s==='9'){
        s ='0'+s
    }
    return s
 }
function prune(data){
    let d = date.split(",");
    let mini = d[0].split("/");
    swap(0,1,mini);
    swap(0,2,mini);
    mini[1]= check(mini[1]);
    mini[2]= check(mini[2]);
    d[1]=d[1].trim();
    d[1]=  d[1].replace(/\D/g, '');
    let dawg = [...mini,d[1]]
    let steptwo = dawg.join("");
    let final = parseInt(steptwo)
    let giveBack = [];
    for (let i = 0;i<data.length;i++){
      data[i].DateTime = data[i].DateTime.replace(/\D/g, '');
      data[i].DateTime = parseInt(data[i].DateTime);
      //console.log(data[i].DateTime-14);
      delete data[i].ShortName
      delete data[i].Day
      delete data[i].LeagueId
      delete data[i].Season
      data[i].bouts = [];

    }
    data = data.filter((user)=>{
        return user.DateTime>final
    })
    return data;
  }
function clean(data){
    for (let i = 1;i<data.Fights.length;i++){
      if (data.Fights[i].Order==null){
        data.Fights.splice(i,1);
        continue;
      }
      if (data.Fights[i-1].Order==null){
        data.Fights.splice(i-1,1);
        continue;
      }
      if (data.Fights[i].Order===data.Fights[i-1].Order){
       // console.log(JSON.stringify(data.Fights[i]) +"\n" + JSON.stringify(data.Fights[i-1]));
        if (data.Fights[i].FightId>data.Fights[i-1].FightId){
          data.Fights.splice(i-1,1);
        }else{
          data.Fights.splice(i,1);
        }
      }
    }
    if (data.Fights[data.Fights.length-1].Order===null){
      data.Fights.splice(data.Fights.length-1,1);
    }
    return data;
  }


export async function Save_n_Add(father, MMA){
  bouts.exists({FightId:MMA.FightId}, function(err,doc){
    if (err){
      console.log(err);
    }if (doc===null){
      MMA.save(function (err,doc){
        if (err){
          //console.log(err)
        }else{
          console.log("Individual save");
        }
      })
      Events.updateOne(
        { EventId: father.EventId }, 
        { $push: { bouts: MMA.FightId} }, function(err, docs){
          if (err){
            //console.log(err.message);
          }else{
            //console.log("doc reads as "+ JSON.stringify(docs));
          }
        });
    }
  })
}
export async function checknsave(object){
  await Events.exists({EventId: object.EventId}, function (err,doc){
    if (err){
      //console.log("err");
    }
    if (doc===null){
      object.save(function(err,doc){
        if (err){
          //console.log(err);
        }else{
          //console.log("saved");
        }
      });
      //console.log("The save was completed");
    }
    getFights(object.EventId, object)
  })
}
export function findAndPushNext(){
  Events.findOne().sort('DateTime').exec( async function(err,member){
   if (err){
     //console.log(err)
   }else if (member!==null || member!==undefined){
     await areLive.exists({EventId: member.EventId}, function (err, doc){
       const live = new areLive();
       LOI(live,member)
       if (doc===null){
         live.save(function(err,doc){
           if (err){
             //console.log(err);
           }else{
             //console.log("saved")
           }
         })
       }
     })
   }
 })
}
export function getFights(ID, father,url = "https://api.sportsdata.io/v3/mma/scores/json/Event/", data = {}) {
  url = url +ID;
  fetch(url,{
    method: 'GET',
    headers: {
      "Ocp-Apim-Subscription-Key": "94d343b80e574457b91a0c338a67109e",
      "Content-Type": "application/json"
    },
  }).then((response)=> response.json()).then(function(data){
    clean(data)
    data.Fights.forEach(obj =>{
      let add = {}
      if (obj.Fighters[0]!==undefined){
        add["FightId"] = obj.FightId;
        add["Fighter1"] = obj.Fighters[0].FirstName + " " + obj.Fighters[0].LastName;
        add["Fighter2"] = obj.Fighters[1].FirstName + " " + obj.Fighters[1].LastName;
        add["WinnerStatus"] = obj.WinnerId;
        add["Order"] = obj.Order;
        const MMA = new bouts();
        mi(MMA,add);
        Save_n_Add(father, MMA);
      }
      }
    );
  }
 )
}
 export function getData(ep ,url = 'https://api.sportsdata.io/v3/mma/scores/json/', data = {}) {
   url = url +ep;
  fetch(url,{
    method: 'GET',
    headers: {
      "Ocp-Apim-Subscription-Key": "94d343b80e574457b91a0c338a67109e",
      "Content-Type": "application/json"
    },
  }).then((response)=> response.json()).then(function(data){
    let stuff = prune(data);
    stuff.forEach(obj => {
        const myWebsite = new Events();
        OI(myWebsite,obj);
        checknsave(myWebsite);
   })
   findAndPushNext();
  }
 )}

 let endpoint = ["Schedule/UFC/2022","Schedule/UFC/2023"]

export function change(toChange){
    let d = toChange.split(",");
    let mini = d[0].split("/");
    swap(0,1,mini);
    swap(0,2,mini);
    mini[1]= check(mini[1]);
    mini[2]= check(mini[2]);
    d[1]=d[1].trim();
    d[1]=  d[1].replace(/\D/g, '');
    let dawg = [...mini,d[1]]
    let steptwo = dawg.join("");
    let final = parseInt(steptwo)
    return final;
}