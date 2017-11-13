---
layout: post
title: "Dependency Injection in AWS Lambda with JavaScript"
tags: aws di ioc lambda serverless
---

It's always a good idea to help better test your code.
http://docs.aws.amazon.com/lambda/latest/dg/best-practices.html

In a typical JavaScript world, dependency injection can be achieved by as simple as injecting
an object.

This has however been proven impossible in AWS Lambda as the contract of the handler is
enforced by AWS, hence it is quite impossible for you to inject anything at all.

AWS Lambda is also the entry point of your application.

We can hack around this by playing with the fact that require in NodeJS is singleton.

Like so.

This is ok until you find that you need to asynchronously read a secret for example which leads to a promise call.
You don't want to call this as you'll be calling real AWS services.

Final result with promise.

