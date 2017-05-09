module.exports = {
  
  noGithubButton: () => {
      return [{
                  "text": "I don't use github",
                  "name": "no_git_button",
                  "value": "no_git_button",
                  "type": "button",
                  "style": "normal"
      }];
    },
  
  
   
    typeButtons: () => {
        return [{

                "text": "Repository",
                "name": "repository",
                "value": "repository",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Commit message",
                "name": "commit",
                "value": "commit",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Organisation",
                "name": "organisation",
                "value": "organisation",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Language",
                "name": "language",
                "value": "language",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Month",
                "name": "month",
                "value": "month",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Year",
                "name": "year",
                "value": "year",
                "type": "button",
                "style": "normal"
            }

        ]

      
      

    },
  
  randomButtons: () => {
    return [{
      "text": "Angriest commit",
      "name": "angriest_commit",
      "value": "angriest_commit",
      "type" : "button",
      "style": "normal"
    }, {
      "text": "Happiest year",
      "name": "happiest_year",
      "value": "happiest_year",
      "type" : "button",
      "style": "normal"
    }, {
      "text": "Most fearful repo",
      "name": "fearful_repo",
      "value": "fearful_repo",
      "type" : "button",
      "style": "normal"
    }]
  },
  
  emotionButtons: () => {
        return [{

                "text": "angriest",
                "name": "angriest",
                "value": "angriest",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "happiest",
                "name": "happiest",
                "value": "happiest",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "most disgusted",
                "name": "most disgusted",
                "value": "most disgusted",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "saddest",
                "name": "saddest",
                "value": "saddest",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "most fearful",
                "name": "most fearful",
                "value": "most fearful",
                "type": "button",
                "style": "normal"
            }

        ]

      
      

    },
  restartButtons: () => {
        return [{

                "text": "Yes",
                "name": "yes",
                "value": "yes",
                "type": "button",
                "style": "primary"
            },
            {
                "text": "No, thanks",
                "name": "no",
                "value": "no",
                "type": "button",
                "style": "danger"
            },
            {
                "text": "How does it work?",
                "name": "how",
                "value": "how",
                "type": "button",
                "style": "normal"
            },
            {
                "text": "Tweet it!",
                "name": "twitter",
                "value": "twitter",
                "type": "button",
                "style": "normal"
            }
           

        ]
    },
  


}