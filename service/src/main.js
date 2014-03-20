var avatar = require("org/glassfish/avatar");

var TwitterStreamFactory = Java.type("twitter4j.TwitterStreamFactory");
var FilterQuery          = Java.type("twitter4j.FilterQuery");
var StatusListener       = Java.type("twitter4j.StatusListener");

var jms = new avatar.JMS({connectionsFactoryName: "jms/__defaultConnectionFactory", destinationName: "jms/avatarQ"});
jms.send("Test message");

var listener = new StatusListener() {
    onStatus: function(status) {
        avatar.log("@" + status.user.screenName + "\t" + status.text);
        jms.send(status);
    }
}

var twitter = new TwitterStreamFactory().instance;
twitter.addListener(listener);
twitter.filter(new FilterQuery(0, [], ['Justin Bieber']));

avatar.registerPushService({
    url: "push/tweeds",
    jms: {
        connectionsFactoryName: "",
        destinationName: "",
        jms: this.jms
    }
}, function(){});
