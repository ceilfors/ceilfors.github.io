---
layout: post
title: "Dependency Injection in AWS Lambda with JavaScript"
tags: aws di ioc lambda serverless
---

Dependency Injection is an important design pattern, and it should practiced in the AWS Lambda world too.
This post will run through you a simple idea on how to achieve it with JavaScript.

Imagine that you have a Lambda that will always return a list of tweets from a certain user.
You'd like to make sure that this Lambda is unit tested by verifying that the number 1000 is used when
tweets are being retrieved.

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

As you can see, this is a classic violation of Dependency inverstion principle as the `new` keyword is clearly shouting
in the code, waiting to be extracted out.

I could not found a clean and easy way to inject my module to a handler, due to the fact that you will need to satisfy
the contract of AWS handler function. The challenging part is you only have one entry point in Lambdas, which is
the handler function. From this one entry point, you'll have to be able to bootstrap the dependencies in runtime and
mock them in test.

One hack I found is the fact that all module.exports object in Node is actually is cached when you require a module, which can be then
treated as a pretend singleton.

```javascript
const TwitterService = require('./lib/twitter-service')

exports.deps = {twitterService: new TwitterService('password')}

exports.handler = (event, context, callback) => {
  return exports.deps.twitterService.getLatestTweets(1000)
    .then(tweets => {
      callback(null, tweets)
    })
}
```

Then in your test, you would then be able to change the `deps` object to your mock.

```javascript
const lambda = require('./lambda')
...

describe('lambda', function () { 
  let twitterService

  beforeEach('mock dependency', function () {
    lambda.deps.twitterService.getLatestTweets = sinon.mock()
    twitterService = lambda.deps.twitterService
  })

  it('should get tweets for user 1000', function () {
    twitterService.getLatestTweets.returns(Promise.resolve())
    return lambda.handler({}, {}, () => {}).then(_ => {
      expect(twitterService.getLatestTweets).to.be.calledWithExactly(1000)
    })
  })
})
```

Why does this work? This is because exports in Node is singleton. Require will retrieve the same object.????
Investigate the correct reasoning.

Although there are quite a number of IoC libraries or frameworks out there, I find that
most of them are too overly complicated for my need hence the idea shown here will not be using
any NPM packages. Lambdas that are split well should not have a lot of dependencies to be managed.

Don't really like Proxyquire as it feels too hacky. If I move my file around my proxyquire will break.
I'm also not a big fan of rewire.

# More complicated example

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

You would typically want your [Lambda handler logic to be dumb][best-practice] and put your domain logic in a separated module. This would allow you to unit test your handler behaviour independently.



This has however been proven impossible in AWS Lambda as the contract of the handler is
enforced by AWS, hence it is quite impossible for you to inject anything at all.

AWS Lambda is also the entry point of your application.

We can hack around this by playing with the fact that require in NodeJS is singleton.

Like so.

This is ok until you find that you need to asynchronously read a secret for example which leads to a promise call.
You don't want to call this as you'll be calling real AWS services.

Final result with promise.


If you are transpiling your code. You can also use export/import.

[best-practice]: http://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#function-code