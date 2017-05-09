
var helpers = require('./helpers');

 module.exports=(emotion,params, crate, cb) => {
   console.log(emotion,params);
  const sql = `
      SELECT date_format('%M %Y', date_trunc('month', ts)) AS "Month",
             avg(f_watson['emotion']['${emotion}']) AS "Emotion"
      FROM github.event
      WHERE f_commit['author'] = any([?, ?])
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 1
      `;
   
   
    crate.execute(sql,params)
      .then(data=>{
        
        const rows = helpers.toObjectArray(data.cols, data.rows);
        if(rows.length === 0){
          throw new Error('no data found');
        }
         
        cb(null, {emotion:rows[0].Emotion, month: rows[0].Month});
      })
      .catch(err=>{
        cb(err,null);
      });
        
}
  