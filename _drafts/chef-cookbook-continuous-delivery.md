---
layout: post
title:  "Chef Cookbook Continuous Delivery"
tags: chef
comments: true
---

This post captures my research and implementation to achieve Continuous Delivery with
Chef. Do share and leave comments if you have a better approach towards achieving our goal.

# Objective

Achieving Continuous Delivery by using Chef as the tool for environment management, application
configuration management and application deployment. Chef Cookbooks that you write will be released
together with your applications.

# Setup

In this setup, I am using Chef with Chef Server. You will find that most of the commands
written in this post are coupled with Chef Server, although you should be able to map it to
Chef Zero/Solo if needed. The CI server that I'm using is Jenkins, although I will try to make
this post as agnostic as possible due to the number of CI tool options we have today,

# Deployment pipeline

Diagram

- Every application build
- Every cookbook build
- Every promotion

# Cookbook Build

[Berkshelf](https://docs.chef.io/berkshelf.html) is the tool that I have picked to manage our cookbooks,
which mean you will have one git repository for each cookbooks you write. *Do note that at the time of writing,
Chef is recommending the usage of [Policyfile](https://docs.chef.io/policyfile.html) instead of Berkshelf*.

On every commit made to your git repository, CI build will kick in the below build steps. You will also need to
complete these steps in less than ten minutes in an ideal CD world.

- Lint your cookbook: [cookstyle](https://docs.chef.io/cookstyle.html) and [foodcritic](http://www.foodcritic.io/).
- Run unit test: [chefspec](https://docs.chef.io/chefspec.html)

    Speeding up:
    - Replace let(:chef_run) with cached(:chef_run). See [this section](https://github.com/sethvargo/chefspec#faster-specs) for more details.
    - Use ChefSpec::SoloRunner instead of ChefSpec::ServerRunner when possible.

- Run integration test: [kitchen](http://kitchen.ci/)

    Speeding up:
    - If the platforms that you support are all supported by docker, check out
      [kitchen-dokken](https://github.com/someara/kitchen-dokken).
    - If using vagrant, check out [vagrant-cachier](http://fgrehm.viewdocs.io/vagrant-cachier/).
      vagrant-cachier is extremely helpful especially when you are downloading a lot of external
      files.
    - If your CI tool support matrix job, use them. You will run each of the individual platform
      test in parallel.

I would highly recommend putting all of the steps above to your `Rakefile` and let `rake` be the tool that
define your build steps, especially because we are using various tools here during the build. Using rake
will make it easier for developers to run the build locally before committing them.

When the build steps were successful, a new _release candidate_ will be made.

- Generate documentation
  
    At the time of writing, there are a lot of tools out there to document Chef cookbooks. Pick your own favourite,
    I'm using [knife-cookbook-doc](http://realityforge.org/knife-cookbook-doc/)

- Bump version on every build

    Use [knife spork](https://github.com/jonlives/knife-spork): `knife spork bump COOKBOOK patch`

- Commit

    Commit those changes we made to `metadata.rb` and README.md (if using knife-cookbook-doc).

- Create a build tag

    Tag your commit with your current CI build number. These _build tags_ will later be used
    for promotion process. The tag naming convention that we are using here is build/[build number] e.g.
    build/100, build/101, build/102, and so on.

- Chef server upload and freeze the version
  
    Execute `berks apply` to upload your cookbook and freeze them. It is crucial for the upload to happen last,
    because you don't want anybody to use cookbooks that didn't pass the tests right?

# Promotion

- Environment cookbook
- Download Berksfile.lock from build tag
- berks apply
- Promote build tag

