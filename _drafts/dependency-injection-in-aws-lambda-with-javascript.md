---
layout: post
title: "Dependency Injection in AWS Lambda with JavaScript"
tags: aws di ioc lambda serverless
---

Dependency Injection is an important design pattern, and it should practiced in the AWS Lambda world too.
This post will run through you a simple idea on how to achieve it with JavaScript.

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

# Simple idea: Exporting the dependencies

Now here is the challenge. This handler function is an entry point for both injecting the
dependencies and running the function. This
is a unique condition. In an ideal world you'd like your function to just focus on running
the function and let someone else inject the dependencies for you, hence the ease of mocking
the dependencies in tests. Due to this reason, I could not found a clean way to inject
the dependencies of our handler function.

Although there are quite a number of IoC libraries or frameworks out there, I find that
most of them are an overkill for my need hence the idea shown here will not be using
any NPM packages. Lambdas that are split well should not have a lot of dependencies to be managed.

The idea: Just like any object, object is returned by a require and you can override it's object.

We can abuse the fact that the object `module.exports` by NodeJS is actually just another object.

In our scenario, that is the twitterService object:

```javascript
const TwitterService = require('./lib/twitter-service')

exports.twitterService = new TwitterService('password')

exports.handler = (event, context, callback) => {
  return exports.twitterService.getLatestTweets(1000)
    .then(tweets => {
      callback(null, tweets)
    })
}
```

The key here is to use `exports.twitterService` in your handler function.

Then in your test, you would then be able to mock twitterService out now:

```javascript
const lambda = require('./lambda')
...

describe('lambda', function () { 
  let twitterService

  beforeEach('mock dependency', function () {
    lambda.twitterService.getLatestTweets = sinon.mock()
    twitterService = lambda.twitterService
  })

  it('should get tweets for user 1000', function () {
    twitterService.getLatestTweets.returns(Promise.resolve())
    return lambda.handler({}, {}, () => {}).then(_ => {
      expect(twitterService.getLatestTweets).to.be.calledWithExactly(1000)
    })
  })
})
```

# 'Promise' a convention

So this is working until you find that you'll need to read the 'password' for the TwitterService from somewhere else like file or SSM for example.
You'd struggle because then, that Object is created live promise chain etc. Which means your code will be executed before it's mocked out. Unfortunately, this is when this model gets quite messy. This is what you'll end up having.

You can easily change it to become a promise and use the fact that the object is still a singleton.

The code
```javascript
const TwitterService = require('./lib/twitter-service')

const getPassword = Promise.resolve('password')

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


The test
```javascript
const lambda = require('./lambda')
...

describe('lambda', function () {
  let twitterService

  beforeEach('mock dependency', function () {
    const deps = {twitterService: {getLatestTweets: sinon.mock()}}
    lambda.deps = () => Promise.resolve(deps)
    twitterService = deps.twitterService
  })

  it('should get tweets for user 1000', function () {
    twitterService.getLatestTweets.returns(Promise.resolve())
    return lambda.handler({}, {}, () => {}).then(_ => {
      expect(twitterService.getLatestTweets).to.be.calledWithExactly(1000)
    })
  })
})
```

This approach of dependency injection would also work with ES2015 modules (presuming you are transpiling your lambda code), this will also work. See example below.

Just replace

```javascript
const lambda = require('./lambda')
```

to
```javascript
import * as lambda from './lambda'
```

# Other libraries
Don't really like Proxyquire as it feels too hacky. If I move my file around my proxyquire will break.
I'm also not a big fan of rewire.

[best-practice]: http://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#function-code