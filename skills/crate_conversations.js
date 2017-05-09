const checkGitHubHandle = require('../crate/checkGitHubHandle');
const fetchType = require('../crate/fetchType');

const getAlternative = require('../crate/getAlternative');
const question = require('../crate/question');
const helpers = require('../crate/helpers');
const tweet = require('../crate/tweet');
const getGiphy = require('../crate/getGiphy');
var crate = require('node-crate');
crate.connect('ibm.cratedb.cloud', 4200);

var gifs = {
  sadness: [],
  joy: [],
  fear: [],
  anger: [],
  disgust: []
}

const getExit = (text) => {
    const types = ['exit', 'quit', 'ciao', 'bye'];
    let result = false;
    types.forEach(type => {
        if (text.includes(type)) {
            result = true;
        }
    })
    return result;

};

const getType = (text) => {
    const types = ['repo', 'commit', 'org', 'year', 'month', 'lan'];
    let result = '';
    types.forEach(type => {
        if (text.includes(type)) {
            result = type;
        }
    })
    return result;

};


const handleInputs = (res, convo) => {
    if (getExit(res.text)) {
        //convo.end();
        convo.next();
    } else {
      var type = getType(res.text);
      var emotion = helpers.getEmotion(res.text);
      console.log('identified', type, emotion);
      if(type && emotion) {
        convo.setVar('type', type);
        convo.setVar('emotion', emotion);
        convo.gotoThread('git_info_2');
      } else {
        convo.setVar('alternative', getAlternative(res.text));
        convo.gotoThread('not-understood');
      }
        
    }
};

const githubHandle = (res, convo) => {
    checkGitHubHandle(res.text, crate, (err, data) => {
        if (err) {
            convo.gotoThread('error_1');
        } else {
            convo.setVar('username', res.text);
            convo.setVar('sediment', data.sediment);
            convo.setVar('commits', data.commits);
            convo.setVar('fullName', data.fullName);
            convo.gotoThread('github_handle_success');
          
        }
    });
}



module.exports = function (controller) {

    controller.hears(['init'], 'direct_message,direct_mention', function (bot, message) {
        bot.createConversation(message, async function (err, convo) {

            convo.say(`Hi <@${message.user}>! I'am *cr8bot*. \nI can tell you all the emotions you had while working on github.`);
            
            //generate gifs
            for(var sentiment in gifs) {
              for(var i = 0; i < 5; i++) {
                gifs[sentiment].push(await getGiphy(sentiment));
              }
            }
            console.log(gifs);
            
            convo.setVar('sorryGif', await getGiphy('sorry'));
            console.log(convo.vars.sorryGif);
            
            convo.ask(question.githubHandleMessage(convo, bot, message), [{
                    pattern: "no_git_button",
                    callback: (res, convo) => {
                        
                        convo.gotoThread('no_git');
                    }
                },
                {
                    default: true,
                    callback: function (res, convo) {
                        bot.reply(message, `Checking and pushing your commits through Watson’s sentiment analysis. This may take some seconds.`);

                        githubHandle(res, convo);
                    },
                }
            ]);


            convo.addQuestion('Please enter a new github handle:', [{
                default: true,
                callback: githubHandle
            }], {}, 'enter_new_username');

          
          
            convo.addQuestion(question.typeQuestion1(), [{
                    pattern: "angriest_commit",
                    callback: (res, convo) => {
                        convo.setVar('type', 'commit');
                        convo.setVar('emotion', 'angriest');
                        convo.gotoThread('git_info');
                    }
                }, {
                    pattern: "happiest_year",
                    callback: (res, convo) => {
                        convo.setVar('type', 'year');
                        convo.setVar('emotion', 'happiest');
                        convo.gotoThread('git_info');
                    }
                }, {
                    pattern: "fearful_repo",
                    callback: (res, convo) => {
                        convo.setVar('type', 'repository');
                        convo.setVar('emotion', 'most fearful');
                        convo.gotoThread('git_info');
                    }
                }, {
                    default: true,
                    callback: handleInputs

                }
            ], {}, 'type_options_1');
          
          convo.addQuestion(question.typeQuestion2(), [{
                    pattern: "repository",
                    callback: (res, convo) => {
                        convo.setVar('type', 'repository');
                        convo.gotoThread('git_info_2');
                    }
                },
                {
                    pattern: "commit",
                    callback: (res, convo) => {
                        convo.setVar('type', 'commit');
                        convo.gotoThread('git_info_2');
                    }
                },
                {
                    pattern: "language",
                    callback: (res, convo) => {
                        convo.setVar('type', 'language');
                        convo.gotoThread('git_info_2');
                    }
                },
                
                {
                    pattern: "organisation",
                    callback: (res, convo) => {
                        convo.setVar('type', 'organisation');
                        convo.gotoThread('git_info_2');
                    }
                },
                {
                    pattern: "month",
                    callback: (res, convo) => {
                        convo.setVar('type', 'month');
                        convo.gotoThread('git_info_2');
                    }
                },{
                    pattern: "year",
                    callback: (res, convo) => {
                        convo.setVar('type', 'year');
                        convo.gotoThread('git_info_2');
                    }
                },
                
                
                {
                    default: true,
                    callback: handleInputs

                }
            ], {}, 'type_options_2');
          
          convo.addQuestion(question.emotionQuestion(), [{
                    pattern: "angriest",
                    callback: (res, convo) => {
                        convo.setVar('emotion', 'angriest');
                        convo.gotoThread('type_options_2');
                    }
                },
                {
                    pattern: "most disgusted",
                    callback: (res, convo) => {
                        convo.setVar('emotion', 'most disgusted');
                        convo.gotoThread('type_options_2');
                    }
                },
                
                {
                    pattern: "happiest",
                    callback: (res, convo) => {
                        convo.setVar('emotion', 'happiest');
                        convo.gotoThread('type_options_2');
                    }
                },
                {
                    pattern: "saddest",
                    callback: (res, convo) => {
                        convo.setVar('emotion', 'saddest');
                        convo.gotoThread('type_options_2');
                    }
                },{
                    pattern: "most fearful",
                    callback: (res, convo) => {
                        convo.setVar('emotion', 'most fearful');
                        convo.gotoThread('type_options_2');
                    }
                },
                
                
                {
                    default: true,
                    callback: handleInputs

                }
            ], {}, 'emotion_options');
          
           
          convo.addQuestion(question.restartQuestion(), [{
                    pattern: "yes",
                    callback: (res, convo) => {
                        
                        convo.gotoThread('emotion_options');
                    }
                },
                {
                    pattern: "no",
                    callback: (res, convo) => {
                        
                        convo.next();
                    }
                }, {
                  pattern: "ho",
                  callback: (res, convo) => {
                    convo.gotoThread('how');
                  }
                },
                                                  
                
                {
                    pattern: "twitter",
                    callback: (res, convo) => {
                        convo.gotoThread('tweet');
                    }
                },
                
                
                {
                    default: true,
                    callback: handleInputs

                }
                
        
                
            ], {}, 'restart_question');
          
          
            convo.beforeThread('git_info', (convo, next) => {
                var emotion = helpers.getEmotion(convo.vars.emotion);
                if(emotion) convo.setVar('gif', gifs[emotion][Math.floor(Math.random() * 4.9)]);
                else convo.setVar('gif', '');
                fetchType(convo, next, crate);
            });
          
          convo.beforeThread('git_info_2', (convo, next) => {
                var emotion = helpers.getEmotion(convo.vars.emotion);
                if(emotion) convo.setVar('gif', gifs[emotion][Math.floor(Math.random() * 4.9)]);
                else convo.setVar('gif', '');
                fetchType(convo, next, crate);
            });
          convo.addMessage({
            text: "{{{vars.alternative}}}",
            action: "restart_question"
          }, 'not-understood');
          
          convo.addMessage({
            text: "*Here's what we do:* \nThe cr8bot :robot_face: uses the data from githubarchive.org. We put it into a CrateDB :package: cluster. Let it be analysed by IBM Watson :sleuth_or_spy: and return the sentiments :love_letter: to you.\nEasy as pie. :cake:",
            action: "restart_question"
          }, 'how');
          
          convo.addMessage({
            text: "Check your mentions. The Tweet is out. :hatched_chick:",
            action: "restart_question"
          }, 'tweeted');

            convo.addMessage({
                text: `Sorry we don’t have any commits available, please try another name.`,
                action: 'enter_new_username', // this marks the converation as unsuccessful
            }, 'error_1');
          
            convo.addMessage({
              text: "But wait, there's even more. :rocket:",
              action: 'emotion_options'
            }, 'start_loop');

            convo.addMessage({
                text: 'Your _{{vars.emotion}}_ {{vars.type}} is:\n```\n{{{vars.plainResult}}}\n```\n{{{vars.link}}}',
                action: 'start_loop', // this marks the converation as unsuccessful
                attachments: [
                            {
                                "title": "",
                                "text": "",
                                "fields": [],
                                "actions": [],
                                "fallback": "Image not found",
                                "image_url": "{{{vars.gif}}}"
                            }
                        ]
            }, 'git_info');

          convo.addMessage({
                text: 'sorry there was an error fetching your Data',
                action: 'start_loop', // this marks the converation as unsuccessful
                attachments: [
                            {
                                "title": "",
                                "text": "",
                                "fields": [],
                                "actions": [],
                                "fallback": "Image not found",
                                "image_url": "{{{vars.errorGif}}}"
                            }
                        ]
            }, 'git_info_error');
          
            convo.addMessage({
               text: 'Your _{{vars.emotion}}_ {{vars.type}} is:\n```\n{{{vars.plainResult}}}\n```{{{vars.link}}}',
                action: 'restart_question', // this marks the converation as unsuccessful
                attachments: [
                            {
                                "title": "",
                                "text": "",
                                "fields": [],
                                "actions": [],
                                "fallback": "Image not found",
                                "image_url": "{{{vars.gif}}}"
                            }
                ]
            }, 'git_info_2');
          
            convo.addMessage({
                    "text":'{{{vars.sediment.message}}}',
                          "attachments": [
                            {
                                "title": "",
                                "text": "",
                                "fields": [],
                              
                                "actions": [],
                                "fallback": "Image not found",
                                "image_url": "{{{vars.sediment.gif}}}"
                            }
                        ],

                    "action": 'type_options_1'
                }

                , 'github_handle_success');

            convo.addMessage({
                    "text":`Oh <@${message.user}> that's a pity! For now I can only work with github users.\nSorry, I'm still not an AI yet ;)`,
                          "attachments": [
                            {
                                "title": "",
                                "text": "",
                                "fields": [],
                                "actions": [],
                                "fallback": "Image not found",
                                "image_url": "{{{vars.sorryGif}}}"
                            }
                        ],

                    "action": 'stop'
                }

                , 'no_git');
          
          
          convo.addQuestion(`Perfect <@${message.user}>, let me know your *twitter username* :bird::`, [{
                    pattern: "yes",
                    callback: (res, convo) => {
                        
                        convo.gotoThread('emotion_options');
                    }
                },
                {
                    pattern: "no",
                    callback: (res, convo) => {
                        
                        convo.next();
                    }
                }, {
                    default: true,
                    callback: (res,convo)=>{tweet(res,convo,message,bot)}
                }],{},'tweet');


            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function (convo) {
                if (convo.successful()) {
                    bot.reply(message, "Thanks for talking to me, although I'm just a :robot_face:. \n If you want to chat with me again, just type *@cr8bot init*.");
                }
            });
            convo.onTimeout(function(convo) {
              convo.say('Oh no! The time :timer_clock: limit has expired. Type *@cr8bot init* to start over.');
              convo.next();
            });
        });

    });

};