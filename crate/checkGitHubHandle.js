var request = require('request');
var helpers = require('./helpers');
var getGiphy = require('./getGiphy');

const fullNameSql=
      `SELECT f_commit['author'] AS "Author", 
         count(*) AS "Count"
       FROM github.event
       WHERE tags['actor'] = ?
       GROUP BY f_commit['author'] 
       ORDER BY count(*) DESC
       LIMIT 5`;
 
const commitCountSql = 
      `SELECT count(*) as "Count"
        FROM github.event 
        WHERE f_commit['author'] = any([?, ?])`;


const sedimentSql = `SELECT avg(f_watson['emotion']['sadness']) AS "Sadness",
       avg(f_watson['emotion']['disgust']) AS "Disgust",
       avg(f_watson['emotion']['joy']) AS "Joy",
       avg(f_watson['emotion']['anger']) AS "Anger",
       avg(f_watson['emotion']['fear']) AS "Fear"
      FROM github.event 
      WHERE f_commit['author'] = any([?, ?]) limit 100;`



async function getSediment(result){
  
  console.log(result);
  let val= 0;
  let res = {singular: '', plural:'',emotion:''};
  
  if(result.Sadness > val){
    val= result.Sadness;
    res.singular = 'sad';
    res.plural= 'sad';
    res.emotion= 'sadness';
    res.message = 'Oh no, you are a *sad* committer!';
    res.gif=await getGiphy('sad');
    
  }
  if(result.Disgust> val){
    val = result.Disgust;
    res.singular = 'disgusted';
    res.plural= 'disgusted';
    res.emotion= 'disgust'
    res.message = 'Oh no, you are a *disgusted* committer!';
    res.gif= await getGiphy('disgust');
  }
  if(result.Anger > val){
    val = result.Anger;
    res.singular= 'angry';
    res.plural = 'angry';
    res.emotion= 'anger';
    res.message = `Oh I'm scared, you are an *angry* committer!`;
    res.gif = await getGiphy('angry');
  }
  if(result.Joy > val){
    val = result.Joy;
    res.singular= 'happy';
    res.plural = 'happiest';
    res.emotion= 'joy';
    res.message = 'Yay, you are a *happy* committer!';
    res.gif= await getGiphy('happy');
  }
  
  if(result.Fear> val){
    val= result.Fear;
    res.singular= 'fearded';
    res.plurar = 'fearded';
    res.emotion= 'fear';
    res.message = 'Oh no, you are a *fearded* committer!';
    res.gif= await getGiphy('fear');;
  }
  
  return res;
}

 module.exports= function (githubHandle, crate, cb) {
    let fullName;
    let commits;
    githubHandle = githubHandle.replace('@','');
    const url = `https://ibm.cratedb.cloud/api/v1/gmEjS2CTywj5IsL0zRi8nxfr/github/event/sentiment?actor=${githubHandle}`;
    request(url,  function(error, response, body) {
      let err = null;
      let success = true;
      if(body !== 'OK'){
        err = 'NodeRed failed';
        success= false;
      }else{
        //query the FullName
        crate.execute(fullNameSql,[githubHandle])
           .then(data=>{
              
            const rows = helpers.toObjectArray(data.cols, data.rows);
            if(rows.length === 0){
              throw new Error('no data found');
            }
              fullName = rows[0].Author;
            
            crate.execute(commitCountSql,[fullName,githubHandle])
              .then(data => {
                const rows = helpers.toObjectArray(data.cols,data.rows);
                if(rows.length === 0){
                  throw new Error('no data found');
                }
                commits = rows[0].Count;
                
              
                crate.execute(sedimentSql, [fullName,githubHandle]).then(async function(data){
                  const result = helpers.toObjectArray(data.cols,data.rows);
                  if(!result || !result.length === 0){
                    throw new Error('no data found');
                  } 
                  const sediment = await getSediment(result[0]);
                  cb(err, {success:success,fullName:fullName,commits:commits,sediment:sediment});          
                })
                  
            });
            
            })
           .catch(err=>{
             cb(err,null);
           });
        
      }
    
      
    });
  }  
