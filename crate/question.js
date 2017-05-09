var action = require('./action');
var attachment = require('./attachment');

module.exports = {
  githubHandleMessage: () => {
    return {
        'text': `Do you want to know which type of committer you are? \nHappy :grinning: or sad :cry:, disgusted :anguished: or angry :rage:? \nJust type your *github username* please:`,
        'attachments': [{
            'title': ``,
            'color': '#44B3C2',
            "actions": action.noGithubButton(),
            "callback_id": "handle"
        }]
    }
},
  typeQuestion1: () => {
    return {
      'text': 'Heya, I can show you more. Chose one of those!',
        'attachments': [{
            'title': `Some random queries`,
            'text': ``,
            'color': '#44B3C2',
            "actions": action.randomButtons(),
            "callback_id": "type_options_2"
        }]
    }
},
  typeQuestion2: () => {
    return {
      'text': `Perfect! Let's explore your *{{vars.emotion}}* activities.\n Now choose your activity type.`,
        'attachments': [ {
            'title': `Your {{vars.emotion}}...`,
            'text': ``,
            'color': '#44B3C2',
            "actions": action.typeButtons(),
            "callback_id": "type_options_2"
        }]
    }
},
  emotionQuestion: () => {

    return {

      'text': `First choose the emotion. :heart:`,
        'attachments': [ {
            'title': ``,
            'text': ``,
            'color': '#44B3C2',
            "actions": action.emotionButtons(),
            "callback_id": "emotion_options"
        }]
    }
},
  restartQuestion: () => {
    return {
      'text': `Do you want to know more?`,
        'attachments': [ {
            'title': ``,
            'text': ``,
            'color': '#44B3C2',
            "actions": action.restartButtons(),
            "callback_id": "restart_options"
        }]
    }
  }
}