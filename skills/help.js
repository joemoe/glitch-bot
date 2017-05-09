/*

Botkit Studio Skill module to enhance the "help" script

*/


module.exports = function(controller) {
    // define a before hook
    // you may define multiple before hooks. they will run in the order they are defined.
    controller.studio.before('help', function(convo, next) {

        // do some preparation before the conversation starts...
        // for example, set variables to be used in the message templates
        // convo.setVar('foo','bar');

        console.log('BEFORE: help');
        // don't forget to call next, or your conversation will never continue.
        next();

    });

    /* Validators */

    // Validate user input: temporary_value
    controller.studio.validate('help','temporary_value', function(convo, next) {

        var value = convo.extractResponse('temporary_value');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: help VARIABLE: temporary_value');

        // always call next!
        next();

    });

    // define an after hook
    // you may define multiple after hooks. they will run in the order they are defined.
    controller.studio.after('help', function(convo, next) {

        console.log('AFTER: help');

        // handle the outcome of the convo
        if (convo.successful()) {

            var responses = convo.extractResponses();
            // do something with the responses

        }

        // don't forget to call next, or your conversation will never properly complete.
        next();
    });
}
