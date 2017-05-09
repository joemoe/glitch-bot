
var helpers = require('./helpers');

 module.exports =(emotion,params, crate, cb) => {
  const sql = `
      SELECT tags['org'] as "org",
             tags['repo'] as "repo",
             f_commit['message'] as "commit"
      FROM github.event
      WHERE f_commit['author'] = any([?, ?])
      ORDER BY f_watson['emotion']['${emotion}'] DESC NULLS LAST
      LIMIT 1`;
   console.log(emotion, params);
    crate.execute(sql,params)
      .then(data=>{
        
        const rows = helpers.toObjectArray(data.cols, data.rows);
        if(rows.length === 0){
          throw new Error('no data found');
        }
         
        cb(null, {organisation:rows[0].org, repository: rows[0].repo, commit: rows[0].commit});

        })
      .catch(err=>{
        cb(err,null);
      });
        
}
  