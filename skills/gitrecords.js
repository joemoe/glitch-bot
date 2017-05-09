var crate = require('node-crate');
crate.connect('ibm.cratedb.cloud', 4200);

const _toObject = (headers, row) => {
  if (headers.length != row.length) return {};
  var obj = {};
  for (var i=0; i<headers.length; i++) {
    obj[headers[i]] = row[i];
  }
  return obj;
};

const _toObjectArray = (cols,rows) => {
  return rows.map(row => {
    return _toObject(cols, row);
  });
};

module.exports = function(controller) {

  controller.hears(['^records'],'direct_message,direct_mention',(bot,message) =>{

    const sql = `select count(*) as records from github`;
      crate.execute(sql,[])
           .then(data=>{
              const rows =_toObjectArray(data.cols, data.rows);
              console.log(rows[0].records);
              bot.reply(message, `total git Records ${rows[0].records}`);
            })
           .catch(err=>{
             console.log(err);
           });
  });

 controller.hears(['^top'],'direct_message,direct_mention',(bot,message) =>{

    const sql = `SELECT payload_pull_request_event['pull_request']['head']['repo']['language'] AS language,
  COUNT(*) AS num_pull_requests,
  COUNT(DISTINCT(repo['id'])) AS num_repos
FROM github
WHERE type = 'PullRequestEvent'
  AND  payload_pull_request_event['pull_request']['head']['repo']['language'] IS NOT NULL
  AND repo['id'] IS NOT NULL
GROUP BY 1
ORDER BY 2 DESC
LIMIT 3;`;

      crate.execute(sql,[])
           .then(data=>{
              const rows =_toObjectArray(data.cols, data.rows);
              const strs = rows.map((row,idx)=>{
                return `${idx+1} ) ${row.language} => ${row.num_pull_requests} Pullrequests `;
              });
              bot.reply(message, `Top Languages:\n ${strs.join('\n')}`);
            })
           .catch(err=>{
             console.log(err);
           });
  });

  controller.hears(['^events (.*)'],'direct_message,direct_mention',(bot,message) =>{

    if(message.match[1]){
      console.log(message.match[1]);
      const sql = `select distinct(type) as type from github where actor['login'] = ?`;
        crate.execute(sql,[message.match[1]])
             .then(data=>{
                const rows =_toObjectArray(data.cols, data.rows);
                const values = rows.map(row=>row.type);

                bot.reply(message, `git events from ${message.match[1]}: ${values.join(', ')}`);
              })
             .catch(err=>{
               console.log(err);
             });
    }
  });

};
