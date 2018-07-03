---
layout: post
title: "Better Dependency Injection with Laconia (AWS Lambda - Node.js)"
tags: aws di ioc lambda serverless laconia
comments: true
---

Dependency Injection is an important design pattern in any software development
paradigm, including the Serverless world. In AWS Lambda, I was not
satisfied with any of the approach that I have found. I have covered
this topic previously and [come up with a simple convention](https://www.ceilfors.com/2017/12/03/dependency-injection-in-aws-lambda-nodejs.html).
That convention works, but I really want to see if I can make it better.
Introducing [Laconia](https://github.com/ceilfors/laconia).

![Laconia Shield]({{ site.url }}/assets/image/{{page.id}}/laconia-shield.png)

Laconia is a micro framework that I've been developing recently. It is design
specifically for Lambda and is taking a very lightweight approach.
Package size matters for your Lambda performance, hence Laconia core package size
is currently only about 12 KB when zipped.

# The Handler

I'm going to a use a similar scenario that I have used in my previous blog post,
simply, we have a Lambda that will always return a list of tweets from user id 1000.

With Laconia, the Lambda can be written like so:

```js
const { laconia } = require("laconia-core");

// Create the dependencies
const instances = async () => {
  const password = await getPassword();
  return { twitterService: new TwitterService(password) };
};

// Grab the dependency you need by destructuring
const handler = ({ twitterService }) => {
  return twitterService.getLatestTweets(1000);
};

// Bootstrap laconia
exports.handler = laconia(handler).register(instances);
```

That's it! Notice how clean the handler code is as it's now responsible
purely on the business logic. The the other hand, the dependencies
creation is also encapsulated in a single function and can be implemented
simply by returning an object.

## Unit Testing

In our unit test, we will make sure that this Lambda is unit tested by verifying that
the user id 1000 is used when tweets are being retrieved. As unit testing is a first
class citizen in Laconia, testing your handler function will be a breeze. Laconia
provides `run` method to run your Lambda handler code without worrying on
your dependencies creation. Let's see it in action in the following example:

```js
const lambda = require("./lambda");

let twitterService;

beforeEach("mock dependency", () => {
  // Creates the twitterService. No `exports` hack
  twitterService = { getLatestTweets: jest.mock() };
  twitterService.getLatestTweets.returns(Promise.resolve());
});

it("should get tweets for user 1000", () => {
  // Run your exported handler function with the mocked dependencies
  return lambda.run({ twitterService });
  expect(twitterService.getLatestTweets).toBeCalledWith(1000);
});
```

You can also still test your handler function as normal by invoking
the lambda like a normal function if needed. All of the dependencies
that you declare will be instantiated of course.

## Where are the `event` and `context` object?

When you use Laconia, your dependencies will live around an object
called LaconiaContext. LaconiaContext is the object that we have been
destructuring in the handler function to retrieve the `twitterService`,
and the object that we have created in the unit test to pass `twitterService`.

_Everything that your Lambda needs_ will be contained by LaconiaContext.
This is a very simple and important concept in Laconia. Notice how AWS `event` and
`context` objects are not in sights anymore because they live inside LaconiaContext.
Intuitively, they are accessible in your handler function via `event` and `context`
keys:

```js
const handler = ({ event, context }) => {};
```

As it is very common to configure your Lambda via environment variables, LaconiaContext
also contains the `process.env` object and make it available via `env` key:

```js
const handler = ({ env }) => {
  console.log(env.MY_ENV_VAR);
};
```

You might ask why would I need to access my environment variables this way?
This is for better testability of your code. If you use `process.env` in your code, you'd have to set
the enviroment variables you need in your unit test globally. As it's being set
globally, you'll also have to make sure
that you are resetting the environment variables after your test run to make sure that
it doesn't interfere with your other test scenarios.

## Closing

Laconia makes it possible for you to semantically split the responsibility
of your creation of dependencies and handler logic. Declaring the dependencies that
you need in the handler function is made lightweight by using destructuring.

I also believe that a well written Lambda should be small and cohesive, hence
there should not be a need of having an automatic dependencies wiring. This is reflected
by the need of creating those objects manually in your code.

Unit testing is a first class citizen in Laconia, hence there is no need to use any
additional testing library to mock the dependency creation step. There is also no need
to have a workaround like exporting the _real handler_ function differently or using
the `exports` object like what I have covered in my previous test.

Lastly, Laconia is still very new, please comment if you have any feedback on this
framework. There are more to come!
