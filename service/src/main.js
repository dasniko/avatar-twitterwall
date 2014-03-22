// references to Java objects
var TwitterStreamFactory = Java.type("twitter4j.TwitterStreamFactory");
var FilterQuery = Java.type("twitter4j.FilterQuery");
var StatusListener = Java.type("twitter4j.StatusListener");

// requires
var avatar = require("org/glassfish/avatar");
var conf = require("twitter-config").conf();
var _ = require("underscore-min");

// set up data provider
var dataProvider = new avatar.FileDataProvider({filename: "/tmp/tweets.txt", key: "id"});
dataProvider.delCollection();

// set up Twitter listener
var listener = new StatusListener({
    onStatus: function(status) {
		// convert the status Java object to a JSON object
		var tweet = {id: status.id,
			createdAt: (status.createdAt + ""),
			screenName: status.user.screenName,
			text: status.text};
        dataProvider.create(tweet);
    },
    onException: function(err) {
        avatar.log("t4jException occurred: " + err);
    }
});

// get Twitter instance
var twitter = new TwitterStreamFactory(conf.build()).instance;
twitter.addListener(listener);

// register pushService
var tweets;
avatar.registerPushService({url: "push/tweets"},
    function() {
        this.onOpen = function(context) {
			avatar.log("onOpen called");
			context.setTimeout(1000);
			twitter.filter(new FilterQuery(0, [], ['Starbucks']));
		},
		this.onTimeout = function(context) {
			dataProvider.getCollection()
				.then(function(result){
					var data = result.data;
					tweets = {items: _.last(data, 25).reverse()};
				});
            context.setTimeout(2000);
			return context.sendMessage(tweets);
        },
		this.onClose = function(context) {
			avatar.log("onClose called");
			twitter.cleanUp();
		};
    }
);