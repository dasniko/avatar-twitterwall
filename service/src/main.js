"use strinct";

// requires
var avatar = require("org/glassfish/avatar");
var conf = require("twitter-config").conf();
var _ = require("underscore-min");

// references to Java objects
var TwitterStreamFactory = Java.type("twitter4j.TwitterStreamFactory");
var FilterQuery = Java.type("twitter4j.FilterQuery");
var StatusListener = Java.type("twitter4j.StatusListener");

// set up data provider
var dataProvider = new avatar.FileDataProvider({filename: "/tmp/tweets.txt", key: "id"});
dataProvider.delCollection();

// set up Twitter listener
var listener = new StatusListener({
    onStatus: function (status) {
        // convert the status Java object to a JSON object
        var tweet = {id: status.id,
            createdAt: (status.createdAt + ''),
            screenName: status.user.screenName,
            text: status.text};
        dataProvider.create(tweet);
    },
    onException: function (err) {
        avatar.log("t4jException occurred: " + err);
    }
});

// get Twitter instance
var twitter = new TwitterStreamFactory(conf.build()).instance;
twitter.addListener(listener);

// init local variables
var query;
var tweets;
var initVars = function () {
    query = "";
    tweets = {items: []};
};

var stopTwitter = function () {
    avatar.log("stop receiving Twitter updates");
    twitter.cleanUp();
    initVars();
};

// register restService for receiving search queries
avatar.registerRestService(
    { url: "rest/query" },
    function () {
        this.onPut = function (request, response) {
            query = request.data.query;
            avatar.log("onPut called: " + query);
            if (query !== "") {
                twitter.filter(new FilterQuery(0, [], [query]));
            }
            response.send(null);
        };
        this.onDelete = function (request, response) {
            avatar.log("onDelete called");
            stopTwitter();
            response.send(null);
        };
        this.onGet = function (req, res) {
            res.send(query || '');
        };
    }
);

// register pushService
avatar.registerPushService(
    {url: "push/tweets"},
    function () {
        this.onOpen = function (context) {
            avatar.log("onOpen called - init push service");
            initVars();
            context.setTimeout(1);
        };
        this.onTimeout = function (context) {
            // get last 25 Twitter messages from data provider
            dataProvider.getCollection()
                .then(function (result) {
                    tweets = {items: _.last(result.data, 25).reverse()};
                });
            context.setTimeout(2000);
            // send tweets to client(s)
            return context.sendMessage(tweets);
        };
        this.onClose = function (context) {
            avatar.log("onClose called");
            stopTwitter();
        };
    }
);