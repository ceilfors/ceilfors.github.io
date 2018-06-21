---
layout: post
title: "Dependency Injection in AWS Lambda with Laconia (Node.js)"
tags: aws di ioc lambda serverless laconia laconia
comments: true
---

Importance of DI.

In previous post, approach has been given to cover promises.
https://www.ceilfors.com/2017/12/03/dependency-injection-in-aws-lambda-nodejs.html

I'm going to use a similar example again which is a twitter service for user 1000.
Note that this is not a direct comparison with the previous post as AWS Lambda now
supports Node 8.

Since then I have developed a framework.
The singleton approach is not great.
This framework is very lightweight. Simple destructuring.

With Laconia, the above code can be written as:

```js
const { laconia } = require("laconia-core");

const instances = async () => {
  const password = await getPassword();
  return { twitterService: new TwitterService(password) };
};

exports.handler = laconia(async ({ twitterService }) => {
  return await twitterService.getLatestTweets(1000);
}).register(instances);
```

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
