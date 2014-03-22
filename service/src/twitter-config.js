var ConfigurationBuilder = Java.type("twitter4j.conf.ConfigurationBuilder");

module.exports.conf = function() {
	var conf = new ConfigurationBuilder();
	conf.setOAuthConsumerKey("****");
	conf.setOAuthConsumerSecret("****");
	conf.setOAuthAccessToken("****");
	conf.setOAuthAccessTokenSecret("****");
	return conf;
};