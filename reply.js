var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

//Setting up a user stream
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {

   var replyto = eventMsg.user.screen_name;
   var text1 = eventMsg.text;
   var from1 = eventMsg.user.name;

   console.log(replyto + ' '+ from1);

   /*if (replyto =='other user handle') {*/
    var newtweet = '@' + replyto + ' Hello!';
    tweetIt(newtweet);
 /*  } */

}

function tweetIt(txt) {

    var tweet = {
     status: txt
     }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
      if (err) {
        console.log("Something went wrong!");
      } else {
        console.log("It worked!");
      }
    }
}
