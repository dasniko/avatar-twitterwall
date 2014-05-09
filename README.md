Avatar Twitterwall
==================

This is a small demo for a kind of a twitterwall, build with [Project Avatar](https://avatar.java.net).

Project Avatar is based on the [Nashorn](http://openjdk.java.net/projects/nashorn/) ([Blog](https://blogs.oracle.com/nashorn/)) JavaScript engine of [Java Development Kit 8](https://jdk8.java.net/).<br/>
Currently, Project Avatar needs a [Glassfish 4](https://glassfish.java.net) application server to run.<br/>
A WebLogic runtime will hopefully follow soon by Oracle. Other JavaEE application servers are not supported yet.

This twitterwall project makes use of the [Twitter4J](http://twitter4j.org/) java library by Yusuke Yamamoto and the [Google Gson](https://code.google.com/p/google-gson/) library for serializing Java objects to JSON objects.

Enter a search query into the field (or use the default), push the search button and see what happens.<br/>
Tweets are a realtime stream and updated every two seconds.