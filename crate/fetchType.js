var helpers = require('./helpers');
const getGitInfosBySediment = require('./getGitInfosBySediment.js');
const getYearBySediment = require('./getYearBySediment.js');
const getMonthBySediment = require('./getMonthBySediment.js');
const getLanguageBySediment = require('./getLanguageBySediment.js');
const getGiphy = require('./getGiphy');

module.exports = async function (convo, next, crate) {
    const emotion = convo.vars.emotion ? convo.vars.emotion : convo.vars.sediment.emotion;
    const type = convo.vars.type;
    // do something complex here
  
    convo.setVar('errorGif',await getGiphy('error'));
    convo.setVar('link', '');
    convo.setVar('errorMessage',null);
    convo.setVar('queryResult', null);
    convo.setVar('plainResult', null);
  
    if (type === 'month') {
        getMonthBySediment(helpers.getEmotion(emotion), [convo.vars.fullName, convo.vars.username], crate, (err, result) => {
            if (err) {
              convo.setVar('queryResult','error fetching data');
                console.log('error fetching data', err);
                convo.setVar('errorMessage',err.message);
                convo.gotoThread('git_info_error');
            } else {
                convo.setVar('queryResult', result.month);
                convo.setVar('plainResult', result.month);
            }
            next();
        });
      
    } else if (type === 'year') {
        getYearBySediment(helpers.getEmotion(emotion), [convo.vars.fullName, convo.vars.username], crate, (err, result) => {
            if (err) {
              convo.setVar('queryResult','error fetching data');
                console.log('error fetching data', err);
                convo.setVar('errorMessage',err.message);
                convo.gotoThread('git_info_error');
            } else {

                convo.setVar('queryResult', result.year);
                convo.setVar('plainResult', result.year);
            }
            next();
        });

    } else if (type === 'language') {
        getLanguageBySediment(helpers.getEmotion(emotion), [convo.vars.fullName, convo.vars.username], crate, (err, result) => {
            if (err) {
                convo.setVar('queryResult','error fetching data');
                console.log('error fetching data', err);
                convo.setVar('errorMessage',err.message);
                convo.gotoThread('git_info_error');
            } else {
                convo.setVar('queryResult', result.language);
                convo.setVar('plainResult', result.language);
                convo.setVar('link', 'https://github.com/search?q=user%3Aconvo.vars.username+language%3A' + result.language);
            }
            next();
        });
      
    } else if (type === 'repository' || type === 'commit' || type === 'organisation') {

        getGitInfosBySediment(helpers.getEmotion(emotion), [convo.vars.fullName, convo.vars.username], crate, (err, result) => {
            if (err) {
              convo.setVar('errorMessage',err.message);
              console.log('error fetching data', err);
              convo.gotoThread('git_info_error');
            } else {

                convo.setVar('queryResult', result[type]);
                convo.setVar('plainResult', result[type]);
                if(type === 'repository' || type === 'organisation') {
                  convo.setVar('link', 'http://github.com/' + result[type]);
                }
            }
            next();
        });
      
    } else {
        convo.say('Sorry, I cannot understand your commands! :cold_sweat:');
        convo.gotoThread('emotion_options');
    }
}