---
layout: post
title: "Dependency Injection in AWS Lambda Handler (Node.js)"
tags: aws di ioc lambda serverless
---

Dependency Injection is an important design pattern, and it should practiced in the AWS Lambda world too.
This post will run through you a clean simple idea on how to achieve it with Node.js without the use
of any framework or library.

Imagine that we have a Lambda that will always return a list of tweets from a certain user.
In our unit test, we'd like to make sure that this Lambda is unit tested by verifying that
the number 1000 (think user id) is used when tweets are being retrieved. The Lambda then
will be written like so:

```javascript
const TwitterService = require('./lib/twitter-service')

exports.handler = (event, context, callback) => {
  const twitterService = new TwitterService('password')
  return twitterService.getLatestTweets(1000)
    .then(tweets => {
      callback(null, tweets)
    })
}
```

As you can see, this is a classic violation of Dependency Inverstion Principle as the `new` keyword is
clearly shouting in the code, waiting to be extracted out.

# The exports object

Now here is the challenge. AWS Lambda handler function is an entry point for both injecting the
dependencies and running the function. This
is a unique condition. In an ideal world, your function can just focus on running
the function and someone else will inject the dependencies for you, hence the ease of mocking
the dependencies in tests. Due to this reason, I could not found a clean way to inject
the dependencies of our handler function.

Here is the simple idea, from the the [node documentation](https://nodejs.org/api/modules.html#modules_modules):

> Functions and objects are added to the root of a module by specifying additional properties on the special `exports` object.

We often forget that Node.js module system is so simple that the `exports` that we would normally use
to export functions is basically just an object. That means just like any other objects, you would
be able to set and override its default properties and mock them out. *Let's promote our
dependency to become the module's property*.
In our scenario, that is the twitterService:

```javascript
const TwitterService = require('./lib/twitter-service')

exports.twitterService = new TwitterService('password')

exports.handler = (event, context, callback) => {
  // Note that we are using exports.twitterService here
  return exports.twitterService.getLatestTweets(1000)
    .then(tweets => {
      callback(null, tweets)
    })
}
```

Back to our test, we can now mock the `twitterService` easily and verify that
the number 1000 is used, which was the original unit test goal in this post:

```javascript
const lambda = require('./lambda')
...

describe('lambda', function () { 
  let twitterService

  beforeEach('mock dependency', function () {
    lambda.twitterService.getLatestTweets = sinon.mock()
    twitterService = lambda.twitterService
    twitterService.getLatestTweets.returns(Promise.resolve())
  })

  it('should get tweets for user 1000', function () {
    return lambda.handler({}, {}, () => {}).then(_ => {
      expect(twitterService.getLatestTweets).to.be.calledWithExactly(1000)
    })
  })
})
```

# 'Promise' a convention

Notice the code example we've been using:

```javascript
exports.twitterService = new TwitterService('password')
```

This is a bad practice as we are storing our twitter password as plaintext (Yes I know that twitter
authentication requires more than this, I'm just using this as an example secret), hence potentially
the need of reading the secrets from a AWS Service such as SSM. The convention that we had 
in the previous section will not suffice.

Additionally, the code that we have previously will always run before it is mocked. If you have a
heavy operation within TwitterService's constructor, it will be run first before your test is started as
this is the nature of `require`.

Because of these two problems, I have a convention that I always use now to export my dependencies:

* Export a function, so that the heavy operation will not run until you call it
* Return a promise, so that you can have async operation when bootstrapping the dependency e.g. reading files, hitting other AWS service, etc.

The code then would now look like this:

```javascript
...

exports.deps = () => {
  return getPassword().then(password =>
    ({ twitterService: new TwitterService(password) }))
}

exports.handler = (event, context, callback) => {
  return exports.deps().then(deps => {
    deps.twitterService.getLatestTweets(1000)
      .then(tweets => {
        callback(null, tweets)
      })
  })
}
```

Notice that `getPassword()` will not be called until you call `deps()` in the handler function, and
because we will be mocking `deps` in our unit test, `getPassword()` will never be called until it is
deployed:

```javascript
...
  beforeEach('mock dependency', function () {
    const deps = {twitterService: {getLatestTweets: sinon.mock()}}
    lambda.deps = () => Promise.resolve(deps)
    twitterService = deps.twitterService
    twitterService.getLatestTweets.returns(Promise.resolve())
  })
...
```

The rest of the test code looks the same.

# ES2015 import/export

This approach of dependency injection would also work with ES2015 modules
if you are planning to transpile your code. 

In your production code:

```javascript
...
const deps = () => {
  ...
const handler = (event, context, callback) => {
  return exports.deps().then(deps => {
  ...
export { deps, handler }
```

Do note that you still have to use `exports.deps()`. Then in the test code, replace require with ES2015 import:

```javascript
import * as lambda from './lambda'
```

# Frameworks or libraries
Although there are quite a number of IoC libraries or frameworks out there, I find that
most of them are an overkill for my need so far. I believe that Lambdas that are designed
well should be very small and contained that you would not have a lot of dependencies which are
too difficult to be managed.

There are also libraries like `proxyquire` or `rewire` which can be used to monkey patch your unit test.
They are all working and can be used, I however am finding that my unit tests that are written with
these libraries will have too much of implementation leak.
Too much of internals are to be exposed in the unit tests to enable the monkey patching. For example with proxyquire,
you'll have to know that twitterService is required from `'./lib/twitter-service'`. If you are moving your file
around, you'll also have to change your unit test.
