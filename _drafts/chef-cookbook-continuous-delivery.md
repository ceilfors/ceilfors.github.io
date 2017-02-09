---
layout: post
title:  "Chef Cookbook Continuous Delivery"
tags: chef
comments: true
---

This post captures my research and implementation to achieve Continuous Delivery with
Chef. Do share and leave comments if you have a better approach towards achieving our goal.

# Objective

Achieving Continuous Delivery by using Chef as the tool for managing environments, application
configuration management and application deployment. Chef Cookbooks that you write will be released
together with your applications.

# Setup

In this setup, I am using Chef with Chef Server. You will find that most of the commands
written in this post are coupled with Chef Server, although you should be able to map it to
Chef Zero if needed. 

# Deployment pipeline

Diagram

- Every application build
- Every cookbook build
- Every promotion

# Cookbook Build

[Berkshelf](https://docs.chef.io/berkshelf.html) is the tool that I have picked to manage our cookbooks,
which mean you will have one git repository for each cookbooks you write. *Do note that at the time of writing,
Chef is recommending the usage of [Policyfile](https://docs.chef.io/policyfile.html) instead of Berkshelf*.

On every commit made to your git repository, CI build will kick in the below build steps.

- Lint 
  
  Execute cookstyle and foodcritic

- Unit test

  Execute chefspec

- Integration test

  Execute kitchen

  - Split VMs to speed up build
  - vagrant-cachier

I would highly recommend putting all of the steps above to your `Rakefile` and let `rake` be the tool that
define your build steps, especially because we are using various tools here during the build. Using rake
will make it easier for developers to run the build locally before committing them.

When the build steps were successful, a new _release candidate_ will be made.

- knife cookbook doc
- Bump version on every build
- Freeze version
- Commit
- Build tag

- Chef server upload
  
  It is crucial for the upload to happen last. Because you don't want anybody to use cookbooks that didn't pass
  the test right?


# Promotion

- Environment cookbook
- Download Berksfile.lock from build tag
- berks apply
- Promote build tag

