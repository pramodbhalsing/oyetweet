
var _ = require('lodash')
var twit = require('twit');
var config =require('./config');

var T = new twit(config);

var stream = T.stream('user');
stream.on('follow', newFollower);

//unfollow start
// 
//var options = {
  //count: 5000,
 //stringify_ids: true,
//}
 
//var rate = 120
 
//var friends = []
//var followers = []
 
//T.get('friends/ids', options, function (err, friends) {
  //T.get('followers/ids', options, function (err, followers) {
   // var nonfollowers = _.difference(friends.ids, followers.ids);
    //var lengthfol=nonfollowers.length;
 
    //console.log('Unfollowing', lengthfol, 'non-followers')
 
//    var count = 0;
  //  var length = lengthfol;
 
   //(function loop() {
     //if (nonfollowers.length == 0) {
       //console.log('Done.')
        //return
      //}
 
//      var id = nonfollowers.shift();
 
  //    T.post('friendships/destroy', { user_id: id }, function (err, data, res) {
    //    console.log('%d/%d (%d remain)', ++count, length, length - count);
      //})
 
      //setTimeout(loop, rate * 10)
    //})()
  //})
//})

//unfollow finish
















T.stream('statuses/filter', {track: '#Holi'}, function(stream) {

  // ... when we get tweet data...
  stream.on('data', function(tweet) {

    // print out the text of the tweet that came in
    console.log(tweet.text);

    //build our reply object
    var statusObj = {status: "Since you are already interested in Digital Marketing, check out what I found: http://www.only-b2b.com/blogs/14-tips-grow-your-blog-traffic-content-syndication"}
console.log('its running');
    //call the post function to tweet something
    T.post('statuses/update', statusObj,  function(error, tweetReply, response){

      //if we get an error print it out
      if(error){
        console.log(error);
      }

      //print the text of the tweet we sent out
      console.log(tweetReply.text);
    });
  });

  // ... when we get an error...
  stream.on('error', function(error) {
    //print out the error
    console.log(error);
  });
});


// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
T.stream('statuses/filter', {track: '#Digitalmarketing'}, function(stream) {

  // ... when we get tweet data...
  stream.on('data', function(tweet) {

    // print out the text of the tweet that came in
    console.log(tweet.text);

    //build our reply object
    var statusObj = {status: "Hi @" + tweet.user.screen_name + ", Since you are already interested in Digital Marketing, check out what I found: http://www.only-b2b.com/blogs/14-tips-grow-your-blog-traffic-content-syndication"}

    //call the post function to tweet something
    T.post('statuses/update', statusObj,  function(error, tweetReply, response){

      //if we get an error print it out
      if(error){
        console.log(error);
      }

      //print the text of the tweet we sent out
      console.log(tweetReply.text);
    });
  });

  // ... when we get an error...
  stream.on('error', function(error) {
    //print out the error
    console.log(error);
  });
});








function newFollower(followerEvent) {
  console.log('Follower Event is running');
  var name = followerEvent.source.name,
    screenName = followerEvent.source.screen_name,
    id = followerEvent.source.id_str;
  console.log('@' + screenName + ' (' + name + ') has followed you.');
  sendDirectMessage(id, name, screenName)
  follow(screenName);
   tweetIt(screenName);
}

function tweetIt(screenName) {
       //Generate random number to make tweet different from previous ones
       //var r = Math.floor(Math.random()*100); 
       
       //This is our Tweet (status/update)
       var tweet = {
            status: 'Hi @'+screenName + ', Since you are already interested in Digital Marketing, check out what I found: http://www.only-b2b.com/blogs/14-tips-grow-your-blog-traffic-content-syndication'

        };
 
        //This will post our tweet on Twitter
        T.post('statuses/update', tweet, tweeted);
 
        //The Callback function  
        function tweeted(err, data, response) {
 
           //Error handling          
           if (err) {
               console.log(err);
           }
           else {
               console.log('Tweet Posted!');
           }
    }

};





function sendDirectMessage(id, name, screenName) {
  T.post("direct_messages/new", {
    user_id: id,
    text: 'Thank you '+'@'+ screenName + ',for following me. If you need any services related to SEO, Content, Social Media, or email marketing, visit http://www.only-b2b.com or start a conversation here '
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


//function unfollow(screenName) {
 // T.post('friendships/destroy', {
   // screen_name: "Devrath Pradhan"
  //}, (err, data, response) => {
  //  if (err) {
  //    console.log(err)
 //   } else {
//      console.log('un Followed @' + screenName + '.');
//  });
//}

function tweetArticle() {
    rss("http://www.only-b2b.com/blog/", function(err,articles) {
        if(err) {
            throw new Error(err.message);
        } else {
            statusUpdate = "Check out this awesome post! " + articles[0].title + ' ' + articles[0].link;
            sendTweet(statusUpdate);
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
      q: '#Holi',  // REQUIRED
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
//setInterval(function () {
 // window.scrollTo(0,document.body.scrollHeight);
 // $('.not-following .user-actions-follow-button.js-follow-btn button.follow-text').click();
//}, 1000);

//function to generate a random tweet tweet
function ranDom (arr) {

//console.log();
  var index = Math.floor(Math.random() * (5));;
  return arr[index];
};
