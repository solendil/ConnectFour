# Connect Four

A simple Connect Four implementation in node.js.

TODOs, bugs, remarks and possible enhancements:

* The node.js project is based on [Express](http://expressjs.com/).
* The template engine has been changed to [Mustache](https://mustache.github.io/).
* Everything is in [ES6](http://es6-features.org/#Constants) so make sure to activate `chrome://flags/#enable-javascript-harmony` in Chrome!
* The client side is some very simple [jQuery](https://jquery.com/).
* [Grunt](http://gruntjs.com/) is used to pass the code through [JSHint](http://jshint.com/) and [JS Beautifier](https://github.com/beautify-web/js-beautify).
* The AI uses a simple [negamax](https://en.wikipedia.org/wiki/Negamax) without prunning or memoization; the main `Board` object is not optimized (arrays of objects), so the AI is not very strong, yet.
* A very important shortcoming : node.js cannot deal with [long running processes](https://stadolf.wordpress.com/2012/05/10/dealing-concurrently-with-long-running-blocking-tasks-in-node-js/) without stalling its I/O. Workarounds for this problem are hard and convoluted, and are not implemented here. As a result, when the AI thinks, the server stops responding. 
* [Sessions](https://github.com/expressjs/session) allow for many simultaneous games.
* Only playing vs. AI is supported for the moment (no human vs. human).
* Server [sessions do not expire](http://stackoverflow.com/questions/22354004/setting-node-js-express-session-expiration-time-in-sessionstore-in-stead-of-in-c), which is a potential DOS vector, a dedicated middleware is required.

