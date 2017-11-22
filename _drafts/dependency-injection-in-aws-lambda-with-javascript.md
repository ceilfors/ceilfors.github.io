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

# The exports object

Now here is the challenge. AWS Lambda handler function is an entry point for both injecting the
dependencies and running the function. This
is a unique condition. In an ideal world, your function can just focus on running
the function and someone else will inject the dependencies for you, hence the ease of mocking
the dependencies in tests. Due to this reason, I could not found a clean way to inject
the dependencies of our handler function.

Here is a simple idea, from the the [node documentation](https://nodejs.org/api/modules.html#modules_modules):

> Functions and objects are added to the root of a module by specifying additional properties on the special `exports` object.

We forgot that Node.js module system is so simple that the `exports` that we would normally use
export functions is basically just an object. That means just like any other objects, you would
be able to set and override its default properties and mock them out. Here is the simple idea:
*Let's promote our dependency to become the module's property*.
In our scenario, that is the twitterService:

```javascript
const TwitterService = require('./lib/twitter-service')

exports.twitterService = new TwitterService('password')

exports.handler = (event, context, callback) => {
  return exports.twitterService.getLatestTweets(1000) // Note that we are using exports.twitterService here
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

Ok this is not actually working, the mock deps is not cached or something.

Just replace 

```javascript
const lambda = require('./lambda')
```

to
```javascript
import * as lambda from './lambda'
```

# Other libraries
Although there are quite a number of IoC libraries or frameworks out there, I find that
most of them are an overkill for my need hence the idea shown here will not be using
any NPM packages. Lambdas that are split well should not have a lot of dependencies to be managed.


Don't really like Proxyquire as it feels too hacky. If I move my file around my proxyquire will break.
I'm also not a big fan of rewire.

[best-practice]: http://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#function-code