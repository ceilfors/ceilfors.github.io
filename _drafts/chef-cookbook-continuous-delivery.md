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
Chef Zero/Solo if needed. The CI server that I'm using is Jenkins hence some of the terminologies I used
might accidentally be Jenkins specific. I will try to make
this post as agnostic as possible due to the number of CI tool options we have today,

[Berkshelf](https://docs.chef.io/berkshelf.html) is the tool that I have used in this post to to manage the way
we write our cookbooks and dependencies. Adopting it right, you will have one git repository for each cookbooks
you write, as opposed to having them all in one repo like [chef-repo](https://docs.chef.io/chef_repo.html).
*Do note that at the time of writing,
Chef is recommending the usage of [Policyfile](https://docs.chef.io/policyfile.html) instead of Berkshelf*.
If you are not familiar with Berkshelf and their cookbook patterns, I would recommend reading
[this blog post](http://blog.vialstudios.com/the-environment-cookbook-pattern/).

# Deployment pipeline

Diagram

- Every application build
- Every cookbook build
- Every promotion

# Cookbook Build

On every commit made to your git repository, a CI build will kick in the below build steps. You will also need to
complete these steps in less than ten minutes in an ideal CD world.
I would highly recommend putting all of the steps above to your `Rakefile` and let `rake` be the tool that
define your build steps, especially because we are using various tools here during the build. Using rake
will make it easier for developers to run the build locally before committing them.

- Update cookbook dependencies

    Before you execute any build steps below, make sure that you update your cookbook dependencies by
    running the following commands:

    ```
    rm -f Berksfile.lock
    berks install
    ```

    This step is important so that you'll always get the latest cookbook dependencies
    based on the version constraints you have declared in metadata.rb.

    We do not use `berks update` as the command would require you to have Berksfile.lock
    to exist in your workspace, which is not necessarily true.

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
    - If your CI tool support matrix job, use them to test multiple platforms in parallel.
      Do note that I find this rarely helpful in non open source cookbooks, as generally
      you'll only support one platform.

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

- Push

    Push your commit and build tag.

- Chef server upload and freeze the version
  
    Execute `berks apply` to upload your cookbook and freeze them. It is crucial for the upload to happen last,
    because you don't want anybody to use cookbooks that didn't pass the tests right?

- Clean up

    Clean up tag and previous verion of cookbooks

# Environment Cookbook Build

  Sitting beside your application. The build will go together with your application build.
  Extra step to commit your berksfile.lock

# Deployment 

Every cookbook change and application build. Chef push jobs or SSH. Would recommend chef push
jobs to trigger chef-client from your CI.

# Smoke test

Your deployment will not complete without smoke tests. This test must be executed on every
chef-client run you make

It can be as simple as curl ing

I'm using Chef audit mode for the smoke testing.

# Promotion

Happens only to your enviornment cookbook.
If you have multiple applications that are deployed to one server, you must have another application and
environment cookbook build that targets those environments.
This is because of the way berks apply work, which is by design. It would remove all of the 
previous cookbook constraints before applying a new one. Hence if you are applying berks apply
twice with a different cookbook, you'll get unexpected result.

- Download Berksfile.lock from build tag

    Do not git clone. Example usage of bitbucket rest api of raw download file.

- berks apply

    

- Promote build tag

    If you are promoting the release to production. REST API usage here is beneficial as you do
    not want to clone the entire git repository just to create a tag.
