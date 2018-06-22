---
layout: post
title: "Better Dependency Injection with Laconia (AWS Lambda - Node.js)"
tags: aws di ioc lambda serverless laconia laconia
comments: true
---

Dependency Injection is an important pattern, but unfortunately I was not
satisfied with any of the approach that I have found, [including the convention
that I have set for myself in my previous blog post](https://www.ceilfors.com/2017/12/03/dependency-injection-in-aws-lambda-nodejs.html).
The `exports` object usage feels quite hacky both in the production and unit test code.
Ever since then I've been developing a micro framework to
tackle this problem, it's called [Laconia](https://github.com/ceilfors/laconia).

I'm going to a use a similar example code that I have used in my previous blog post again,
but do note that it's not a direct comparison as AWS Lambda now supports Node 8 hence async/await
is now used in this post. So we have a Lambda that will always return a list of tweets from user id 1000.
In our unit test, we’d like to make sure that this Lambda is unit tested by verifying that the number 1000 (think user id)
is used when tweets are being retrieved.

With Laconia, the Lambda can be written like so:

```js
const { laconia } = require("laconia-core");

// Create dependencies
const deps = async () => {
  const password = await getPassword();
  return { twitterService: new TwitterService(password) };
};

// Grab the dependency you need by destructuring
const handler = ({ twitterService }) => {
  return twitterService.getLatestTweets(1000);
};

// Bootstrap laconia
exports.handler = laconia(handler).register(deps);
```

Benefits:

1.  there is an explicit split of responsibility of the dependencies creations and who uses them.
2.  Your handler code will no longer need to call the `deps` function as it will now be called by `laconia`.
3.  Easier to test which will be shown in the next section
4.  Declaring what you need is a simple as using the destructuring syntax

## Unit Testing

With Laconia

Testing with Laconia. There is no need to use proxyquire or rewire.
Or clunky singleton abuse.
Explicit run with a different context.
Run function.

```js
const lambda = require("./lambda");

let twitterService;

beforeEach("mock dependency", () => {
  twitterService = { getLatestTweets: sinon.mock() };
  twitterService.getLatestTweets.returns(Promise.resolve());
});

it("should get tweets for user 1000", () => {
  return lambda.run({ twitterService });
  expect(twitterService.getLatestTweets).to.be.calledWithExactly(1000);
});
```

## The Laconia Context

Very simple and importance concept in Laconia.
Start to see that event, and context are not in sights anymore.
These are now built-in into LaconiaContext.

These are the objects that has been passed around.
`laconiaContext` is a parameter that is accepted by
`run(laconiaContext)`
laconia(fn(`laconiaContext`))

To retrieve AWS original event and context
LaconiaContext also provides this.

Example {event, context}

The intention of LaconiaContext is to provide everything that your Lambda
would need, hence explicitly showing what your dependencies are. This includes
environment variables which is a very common way of configuring your Lambda.

Configuring environment variable is a global variable.
`env` is also available to be injected

## Lightweightness

`new` is still happening. Laconia don't aim to create these instances for you
as I believe a well written Lambda is small.

It's just an object, everything is always available and controlled via destructuring.
