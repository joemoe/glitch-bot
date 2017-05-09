module.exports = function(controller) {

     controller.middleware.receive.use(function(bot, message, next) {
  
         // do something...
       
       if(message.text.includes('<@') ){
         let user = message.text.replace('<','').replace('>','').replace('@','');
         bot.api.users.info({user: user}, (error, response) => {
            if(response.user){
              let {name, real_name} = response.user;
              message.text = name;
            } 
           next();
    })
       }else{
         next();
       }
         
    
   });
    //
    //
    // controller.middleware.send.use(function(bot, message, next) {
    //
    //     // do something...
    //     console.log('SEND:', message);
    //     next();
    //
    // });

}
