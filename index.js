var selenium = require('./selenium.js');
var logName = "webdriverio";

var fb_email = process.env.FB_EMAIL;
var fb_pass = process.env.FB_PASS;

var wishes = [
    'Happy Birthday !!',
    'Happy Birthday! Have a blast.',
    'Many more happy returns of the day',
    'I wish you all the happiness in the world! Happy Birthday.',
    'Just live it out to the fullest and have fun! Happy Birthday',
    'I hope you have the best day ever. Happy Birthday!',
    'Happy Birthday!! May all of your birthday wishes come true.',
    'Happy Birthday! Welcome to the new age.'
];

var getRandomWish = function() {
    var min = 0;
    var max = wishes.length;

    var index = Math.floor(Math.random() * (max - min) + min);
    return wishes[index];
};

selenium.start();

selenium.eventEmitter.on('start', function() {
    console.log('[' + logName + '] start event received.');
    startWebdriverio();
});

function startWebdriverio() {
    var webdriverio = require('webdriverio'),
    client = webdriverio.remote({
        desiredCapabilities: {
            browserName: 'phantomjs',
            'phantomjs.binary.path': require('phantomjs').path,
        },
        logLevel: 'silent',
    }).init();

    client
        .url('https://www.facebook.com')
        .setValue('#email', fb_email)
        .setValue('#pass', fb_pass)
        .click('#loginbutton')
        .pause(1000)
        .isExisting('span*=birthday').then(function(isExisting) {
            if(isExisting) {
                client.element('span*=birthday').click('.fbRemindersTitle')
                    .pause(1000)
                    .setValue('[name="message_text"]', getRandomWish())
                    .keys('Enter')
                    .pause(500);
            } else {
                console.log('[' + logName + '] Looks like there are no birthdays today.');
            }
        }).catch(function(e) {
            console.log('[' + logName + ' error] ' + e.message);
        }).end().then(function() {
            selenium.exit();
        });
}