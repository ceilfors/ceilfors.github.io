---
layout: post
title: "Better Dependency Injection with Laconia (AWS Lambda - Node.js)"
tags: aws di ioc lambda serverless laconia
comments: true
redirect_from:
  - /2018/07/05/better-dependency-injection-with-laconia
---

Dependency Injection is an important design pattern in any software development
paradigm, including in the Serverless world. In AWS Lambda world, I was not
satisfied with any of the approach that I have found. I have covered
this topic previously and [come up with a simple convention](https://www.ceilfors.com/2017/12/03/dependency-injection-in-aws-lambda-nodejs.html).
That convention works, but I really want to see if I can make it even better.
Introducing [Laconia](https://github.com/ceilfors/laconia).

![Laconia Shield](/images/{{page.id}}/shield.png?style=center)

Laconia is a microframework that I've been developing recently. It is designed
specifically for Lambda hence it is taking a very lightweight approach to support
Dependency Injection.
Package size matters for your Lambda performance, hence Laconia core package size
is currently only about 12 KB when zipped.

### The Handler

I'm going to a use a similar scenario that I have used in my previous blog post,
simply, we have a Lambda that will always return a list of tweets from user id 1000.

With Laconia, the handler function can be written like this:

```js
const laconia = require("@laconia/core");

// Creates the dependencies
const instances = async () => {
  const password = await getPassword();
  return { twitterService: new TwitterService(password) };
};

// Declare the dependency you need by destructuring
const handler = ({ twitterService }) => {
  return twitterService.getLatestTweets(1000);
};

// Bootstrap laconia
exports.handler = laconia(handler).register(instances);
```

Voila! Notice how there is a clear separation of responsibility now in the code.
The instances function is responsible for creating the objects that you need
in your handler function. The handler function is responsible to execute
your business logic.

### Unit Testing

In our unit test, we will make sure that
the user id 1000 is used when the tweets are being retrieved. As unit testing is a first
class citizen in Laconia, testing your handler function will be a breeze. Laconia
provides `run` method to run your handler function while bypassing the
objects creation step. Let's see it in action in the following example:

```js
const { handler } = require("./lambda");

let twitterService;

beforeEach(() => {
  // Creates a mocked twitterService
  twitterService = {
    getLatestTweets: jest.fn().mockReturnValue(Promise.resolve())
  };
});

it("should get tweets for user 1000", () => {
  // Runs your exported handler function with the mocked dependencies
  handler.run({ twitterService });
  expect(twitterService.getLatestTweets).toBeCalledWith(1000);
});
```

You can also still test your handler function as normal by invoking
the lambda as a function if needed (All of the dependencies
that you have will be instantiated of course).

### Where are the `event` and `context` objects?

When you use Laconia, your dependencies will live around an object
called LaconiaContext. LaconiaContext is the object that we have
destructured in the handler function to retrieve the `twitterService`,
and the object that we have created in the unit test to pass `twitterService`.

_Everything that your Lambda needs_ will be contained by LaconiaContext.
This is a very simple and important concept in Laconia. Notice how AWS `event` and
`context` objects are not visible anymore as the handler function signature
is now changed. They now live inside the LaconiaContext.
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
This is for better unit testability of your code.
If you use `process.env` in your code, you'd have to set
the environment variables you need in your unit test globally. As it's being set
globally, you'll also have to make sure
that you are resetting the environment variables after your test run to make sure that
it doesn't interfere with your other test scenarios.

### Wrapping Up

Laconia makes it possible for you to semantically split the responsibility
of your objects creation and handler logic. Declaring the dependencies that
you need in the handler function is made lightweight by using destructuring.
I also believe that a well written Lambda should be small and cohesive, hence
there should not be a need of having an automatic dependencies wiring. This is reflected
by the need of creating those objects manually in your code.

Unit testing is a first class citizen in Laconia, hence there is no need to use any
additional testing library to mock the dependency creation step. There is also no need
to have a workaround like exporting the _real handler_ function differently or using
the `exports` object like what I have covered in my previous blog post.

Lastly, Laconia is still very new, please leave a comment if you have any feedback on this
framework. There are more to come!
