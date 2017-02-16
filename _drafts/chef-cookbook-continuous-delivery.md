---
layout: post
title:  "Chef Cookbook Continuous Delivery"
tags: chef
comments: true
---

This post captures the journey of achieving Continuous Delivery surrounding Chef
as the tool for environment management, application configuration management and application deployment.

# Setup

I am using Chef with Chef Server. You will find that most of the commands
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

Some of the contents might seem trivial because throughout my journey, I discovered that
new Chef users have no experience in Ruby (I was in this category) nor writing codes.

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

Below are the typical build steps that should have. The sequence is important.

- Workspace clean up

    Especially when you are using git, you want to avoid recloning your repository on every build
    as it will be very slow. Clean up your workspace before you proceed on any build steps. Deleting
    unversioned files.

    In Jenkins, this step can be done by Jenkins Git Plugin

- Bump version cookbook version

    ```
    export COOKBOOK_NAME=`chef exec ruby -e 'require "chef/cookbook/metadata"; metadata = Chef::Cookbook::Metadata.new; metadata.from_file("metadata.rb"); puts metadata.name'`
    knife spork bump \$COOKBOOK_NAME -o ..
    knife spork check \$COOKBOOK_NAME -o .. --fail
    ```

    [knife spork](https://github.com/jonlives/knife-spork) is used here to bump
    our cookbook patch version on every build. It is important that you 
    bump your cookbook version before updating the cookbook dependencies in Berksfile.lock
    because the Berksfile.lock will also contain your cookbook version that have just bumped
    in this step.

- Update cookbook dependencies

    ```
    rm -f Berksfile.lock
    berks install
    ```

    This step will ensure that you'll always be integrated with the latest cookbook dependencies
    based on the version constraints you have declared in metadata.rb.
    You will need to make sure that Berksfile.lock is deleted before you run `berks install`
    command, failing to do this `berks install` will not update your Berksfile.lock file. Do note
    that the *Workspace clean up* step will not clean Berksfile.lock file in your environment cookbook
    build because the Berksfile.lock file will be versioned controlled. Environment cookbook build
    will be covered more in the next section.
    
    You should also configure your Berksfile to download your upstream
    cookbook dependencies from Chef Server:

    ```
    source :chef_server
    ```

    This is preferable as compared to pulling cookbooks from Git repository as you might have
    pulled a version that didn't pass tests. If you would like to go fancier, you can also
    setup your own Chef Supermarket although this will not be covered in this post.

    You might asked why don't we just use `berks update` command. The reason is because
    this command will require you to have Berksfile.lock
    to exist in your workspace, which is not necessarily true in a non-environment cookbook build.
    You can run `berks install` then `berks update` on every build, but this will be a slower process
    as berks will take twice as much time to resolve your cookbook dependencies.

- Lint your cookbook: [cookstyle](https://docs.chef.io/cookstyle.html) and [foodcritic](http://www.foodcritic.io/).

    Adopt these tools early if you do not want to be buried in thousands of warnings later.
    These tools will help you find unintended bugs and apply a coding standard and styles.

- Run unit test: [chefspec](https://docs.chef.io/chefspec.html)

    Speeding up:
    - Replace let(:chef_run) with cached(:chef_run). See [this section](https://github.com/sethvargo/chefspec#faster-specs) for more details.
    - Use ChefSpec::SoloRunner instead of ChefSpec::ServerRunner when possible.

- Run integration test: [kitchen](http://kitchen.ci/)

    Speeding up:
    - If the platforms that you support are all supported by docker, check out
      [kitchen-dokken](https://github.com/someara/kitchen-dokken) driver.
    - If using docker driver, check out [squid](http://www.squid-cache.org/) to
      cache file downloads.
    - If using vagrant driver, check out [vagrant-cachier](http://fgrehm.viewdocs.io/vagrant-cachier/)
      to cache file downloads. It requires less configuration as compared to squid.
    - If your CI tool support matrix job, use them to test multiple platforms or test suites
      in parallel.

# Environment Cookbook Build

Earlier in this post, I mentioned that you'll have one git repository for every cookbooks you write.
There's an exception for *Environment Cookbooks*. This cookbook will sit beside your application
source code. An example structure for a Maven project:

```
src\
  main\
    java\
cookbook\
  attributes\
    default.rb
  metadata.rb
pom.xml
```

Combining your environment cookbook with your application build will allow you to keep
your application binaries and configuration files to be promoted and deployed together.
This is important as you do not want these two things to diverge e.g. you might apply
the wrong version of configuration file to the wrong application in production.
To ensure their consistency,
you can update the `cookbook/attributes/default.rb` file to point to the updated version
declared in the pom.xml (your application will update its version on every build too).
Doing this will reduce the risk of maintaining all of your environment objects manually.

# Release Candidate

Every cookbook build you make should produce a release candidate, ready to be deployed to your targeted
environments. A release candidate is created when a build is successful, that means all the tests
we have captured in the previous sections passed.

Below are the general steps that you should make after the build steps are completed:

- Generate cookbook documentation
  
    At the time of writing, there are a lot of tools out there to document Chef cookbooks. Pick your own favourite,
    I'm using [knife-cookbook-doc](http://realityforge.org/knife-cookbook-doc/) because it allows
    cookbook attributes to be documented close to the source code. Other tools rely on the
    maintenance of `metadata.rb`, which often be overlooked when your source code evolved.

- Commit

    Commit those changes we made in the workspace:

    - metadata.rb
    - README.md if you have adopted knife-cookbook-doc
    - Berksfile.lock if you are building an environment cookbook

- Create a build tag

    Tag your commit with your current CI build number. These _build tags_ will later be used
    for promotion process. The tag naming convention that we are using here is build/[build number] e.g.
    build/100, build/101, build/102, and so on.

- Push

    Push your commit and build tag to your Git server.

- Chef server upload and freeze the version
  
    Execute `berks upload` to upload your cookbook and freeze them. It is crucial for the upload to happen last,
    because you don't want anybody to use cookbooks that didn't pass the tests right?

- Clean up

    Clean up tag and previous verion of cookbooks

# Deployment 

Every cookbook change and application build. Chef push jobs or SSH. Would recommend chef push
jobs to trigger chef-client from your CI.

# Smoke test

Your deployment will not complete without smoke tests. This test must be executed on every
chef-client run you make

It can be as simple as curl ing

I'm using Chef audit mode for the smoke testing.

# Promotion

Very important on safe deployment i.e. not deploying the latest all every environments

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
