
var helpers = require('./helpers');

 module.exports=(emotion,params, crate, cb) => {
    const sql = `
      SELECT date_format('%Y', date_trunc('year', ts)) AS "Year",
       avg(f_watson['emotion']['${emotion}']) AS "Emotion"
      FROM github.event
      WHERE f_commit['author'] = any([?,?])
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
         
        cb(null, {emtotion:rows[0].Emotion, year: rows[0].Year});
      })
      .catch(err=>{
        cb(err,null);
      });
        
}
  