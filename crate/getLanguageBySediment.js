
var helpers = require('./helpers');

 module.exports=(emotion,params, crate, cb) => {
  console.log(emotion,params);
  const sql = `
      SELECT tags['language'] as "language"
      FROM github.event
      WHERE f_commit['author'] = any([?, ?])
      AND tags['language'] IS NOT NULL
      ORDER BY f_watson['emotion']['${emotion}'] DESC NULLS LAST
      LIMIT 1
      `;
   
    crate.execute(sql,params)
      .then(data=>{
        
        const rows = helpers.toObjectArray(data.cols, data.rows);
        if(rows.length === 0){
          throw new Error('no data found');
        }
         
        cb(null, { language: rows[0].language});
      })
      .catch(err=>{
        cb(err,null);
      });
        
}
  