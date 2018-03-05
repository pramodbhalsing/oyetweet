http = require('http');
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('It is working!\n');
}).listen(3000);

var twit = require('twit');
var config =require('./config');

var T = new twit(config);

var stream = T.stream('user');
stream.on('follow', newFollower); // when someone follows



function newFollower(followerEvent) {
  console.log('Follower Event is running');
  var name = followerEvent.source.name,
    screenName = followerEvent.source.screen_name,
    id = followerEvent.source.id_str;
  console.log('@' + screenName + ' (' + name + ') has followed you.');
  sendDirectMessage(id, name, screenName)
  follow(screenName);
}

function sendDirectMessage(id, name, screenName) {
  T.post("direct_messages/new", {
    user_id: id,
    text: 'Hi ' + screenName + ', Thanks for following me! I am curious -- what is it about my tweets that interests you, and how can I make them better?'
  });
}
function follow(screenName) {
  T.post('friendships/create', {
    screen_name: screenName
  }, (err, data, response) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Followed @' + screenName + '.');
    }
  });
}








// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {
    var params = {
        q: '#Digitalmarketing',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
    T.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            T.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes
setInterval(retweet, 60*1000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
  var params = {
      q: '#Digitalmarketing',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  T.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      T.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
        }
      });
    }
  });
}
// grab & 'favorite' as soon as program is running...
favoriteTweet();
// 'favorite' a tweet in every 60 minutes
setInterval(favoriteTweet, 60*1000);

//function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

