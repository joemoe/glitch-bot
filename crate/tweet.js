var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret,
    access_token_key: process.env.twitter_access_token,
    access_token_secret: process.env.twitter_access_token_secret
});


module.exports = (res, convo, message, bot) => {
    const emotion = convo.vars.emotion;
    const type = convo.vars.type;
    const result = convo.vars.plainResult;

    const username = '@' + res.text.replace('@', '');
    // do something complex here

    bot.api.users.info({
        user: message.user
    }, (error, response) => {
        let {
            name,
            real_name
        } = response.user;
        console.log(name, real_name);
    })


    const tweetStr = `${username}: With the help of #Watson I identified "${result}" as your ${emotion} ${type} on #github. #oscon #cratedb`;

    convo.say("Generating a tweet for you:\n```\n${tweetStr}\n```\n");

    client.post('statuses/update', {
        status: tweetStr
    }, function (error, tweet, response) {
        if (!error) {
            convo.gotoThread('tweeted');
        } else {
            console.log(error);
            convo.gotoThread('twitter_error');
        }
    });

}