---
layout: post
title: "Dependency Injection in AWS Lambda Handler (Node.js)"
tags: aws di ioc lambda serverless
comments: true
---

Dependency Injection is an important design pattern, and it should practiced in the AWS Lambda world too.
This post will run through you a clean simple idea on how to achieve it with Node.js without the use
of any framework or library.

> **UPDATE: 05 Jul 2018**  
> I have developed a micro framework designed for
> AWS Lambda with Dependency Injection support. Check out the
> [introduction here](https://medium.com/@ceilfors/better-dependency-injection-with-laconia-aws-lambda-node-js-c640ca37134d)!

Imagine that we have a Lambda that will always return a list of tweets from a certain user.
In our unit test, we'd like to make sure that this Lambda is unit tested by verifying that
the number 1000 (think user id) is used when tweets are being retrieved. The handler is
written like this:

```javascript
const TwitterService = require("./lib/twitter-service");

exports.handler = (event, context, callback) => {
  const twitterService = new TwitterService("password");
  return twitterService.getLatestTweets(1000).then(tweets => {
    callback(null, tweets);
  });
};
```

As you can see, this is a classic violation of Dependency Inversion Principle as the `new` keyword is
clearly shouting in the code, waiting to be extracted out.

### The exports object

Now here is the challenge. AWS Lambda handler function is an entry point for both injecting the
dependencies and running the function. This
is a unique condition. In an ideal world, your function can just focus on running
the function and someone else will inject the dependencies for you, hence the ease of mocking
the dependencies in tests. Due to this reason, I could not found a clean way to inject
the dependencies of our handler function.

From the the [node documentation](https://nodejs.org/api/modules.html#modules_modules):

> Functions and objects are added to the root of a module by specifying additional properties on the special `exports` object.

We often forget that Node.js module system (or CommonJS) is so simple that the `exports` that we would normally use
to export functions is basically just an object. That means just like any other objects, you would
be able to override its default properties to mock them out. Here is an idea, let's try to promote our
dependency to become the module's property!
In our scenario, that is the twitterService:

```javascript
const TwitterService = require("./lib/twitter-service");

exports.twitterService = new TwitterService("password");

exports.handler = (event, context, callback) => {
  return exports.twitterService.getLatestTweets(1000).then(tweets => {
    callback(null, tweets);
  });
};
```

Note that the handler function is now using `exports.twitterService`.

Back to our test, we can now mock the `twitterService` easily and verify that
the number 1000 is used, which was the original goal of this post:

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

### 'Promise' a convention

Notice the code example we've been using:

```javascript
exports.twitterService = new TwitterService("password");
```

This is a bad practice as we are storing our twitter password as plaintext (Yes I know that twitter
authentication requires more than this, I'm just using this as an example), hence potentially
the need of reading the secrets from somewhere else. The convention that we had
previously will not suffice.

On top of that, the code that we have above will always run before it is mocked. If you have a
heavy or IO operation within TwitterService's constructor, it will be run first before your test is started as
this is the nature of `require`.

Because of these two problems, I have a convention that I always use now to export my dependencies:

- Export a function instead of object, so that the heavy operation will not run until you call it
- Return a promise, so that you can have async operation when bootstrapping the dependency e.g. reading files, hitting other AWS service, etc.

With this convention, the code then would now look like this:

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

### ES6 import/export

If you are transpiling your code (AWS Lambda only supports NodeJS 6.10),
this approach of dependency injection would also work with ES6 modules. The solution
I'm going to provide here is however not tested in non-transpiled ES6 as it is still
in experimental mode at the time of writing, so be aware that it might not work in the
future.

We lose `exports` object in ES6 modules, which one one of the key idea outlined in the
previous sections, hence we need to introduce another object for our own usage.
To do so, you can simply change the `deps` to become an object that have one function,
in the lambda code:

```javascript
...
export const deps = { init: () => {
  return getPassword.then(password =>
    ({ twitterService: new TwitterService(password) }))
}}
...
export const handler = (event, context, callback) => {
  return deps.init().then(deps => {
...
```

Notice how similar `exports.deps()` and `deps.init()` are as we are essentially applying
the same concept here. Then in the unit test:

```javascript
import * as lambda from './lambda'
...
  beforeEach('mock dependency', function () {
    const deps = {twitterService: {getLatestTweets: sinon.mock()}}
    lambda.deps.init = () => Promise.resolve(deps)
...
```

### Frameworks or libraries

Although there are quite a number of IoC libraries or frameworks out there, I find that
most of them are an overkill for my need so far. I believe that Lambdas that are designed
well should be very small and contained that you would not have a lot of dependencies which are
too difficult to be managed.

There are also libraries like `proxyquire` or `rewire` which can be used to monkey patch your unit test.
They are all working and can be used, I however am finding that my unit tests that are written with
these libraries will have too much of implementation leak.
For example with proxyquire,
you'll have to know that twitterService is required from `'./lib/twitter-service'`, which
would mean you'll have to change your unit test if you are moving your file around.
