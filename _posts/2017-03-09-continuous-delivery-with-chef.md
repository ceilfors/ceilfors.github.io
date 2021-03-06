---
layout: post
title:  "Continuous Delivery with Chef"
tags: chef
comments: true
redirect_from:
  - /2017/03/09/continuous-delivery-with-chef
---

The journey I had on achieving Continuous Delivery using Chef
as the tool for environment management, application configuration management and application deployment
have not been easy. Documentations and resources surrounding this topic are quite scarce.
I hope this writing will be helpful and do leave comments to other readers if you have found better
ways of achieving what I'm trying to do.

### Setup

The usage of Chef in this post utilises Chef Server. You will find that most of the commands
written in this post are coupled with Chef Server, although you should be able to map it to
masterless Chef setup (Chef Zero or Solo) if needed.

You will need a CI/CD server. Some of the terminologies or concepts I use might
accidentally be Jenkins specific as that's the tool that I use. I will try to make
explanation I use as agnostic as possible due to the high number of CI/CD server options we have today,

I'm using [Berkshelf](https://docs.chef.io/berkshelf.html) as the dependency management tool for my chef
cookbooks.
Adopting it right, you will have one git repository for every cookbooks
you have, as opposed to having them all in one repo a.k.a. [chef-repo](https://docs.chef.io/chef_repo.html).
If you are not familiar with Berkshelf and its cookbook patterns, I would recommend reading
[this blog post][pattern] as most of the
concepts I use will refer to that blog post.
Do note that at the time of writing,
Chef is recommending the usage of [Policyfile](https://docs.chef.io/policyfile.html) instead of Berkshelf.

Your own written cookbooks (those that aren't deployed to the public supermarket)
will be resolved by Berkshelf via Chef Server. You should have the following statement
in all of your Berksfile:

```ruby
source :chef_server
```

We will only upload our cookbooks once they have a successful build, hence using Chef Sever as a dependency source
will ensure that our upstream cookbook dependencies are stable.
If you would like to go fancier, you can also
setup your own Chef Supermarket although I will not be covering that.

### Deployment Pipeline

Here is the full example of a deployment pipeline when it is implemented with Chef:

![Deployment pipeline](/images{{page.id}}/drawio-deployment-pipeline.png)

The blue colored shapes are the topics that I will cover in this post. All of the arrows that you see
in the diagram are automatic triggers in your CI/CD server, except the arrow with dotted line that points to Production
Stage.

Observe the confluence of two build streams in the Commit Stage. Any change that happens on your cookbook
must trigger your acceptance test even when there is no change in your application.

### Cookbook Build

On every commit made to your git repository, a CI build will kick start a series of build steps.
Ideally, you will want to
complete these build steps in less than ten minutes.
I would recommend putting all of the steps below to a `Rakefile` and
let [`rake`](https://github.com/ruby/rake) be the tool that
define your build steps, especially because we are using various tools here during the build. Using rake
will make it easier for developers to run the build steps locally and make sure that they are successful
before committing them.

Here are the typical build steps that you should have in sequential order:

- Workspace clean up

    Don't delete your entire build workspace as you would want to avoid
    recloning your repository on every build. It will be very slow.
    Clean up your workspace before you proceed on any build steps by reverting all of the changes
    done by the previous build and deleting all of the unversioned files.

- Bump cookbook version

    ```shell
    export COOKBOOK_NAME=`chef exec ruby -e 'require "chef/cookbook/metadata"; metadata = Chef::Cookbook::Metadata.new; metadata.from_file("metadata.rb"); puts metadata.name'`
    knife spork bump $COOKBOOK_NAME -o ..
    knife spork check $COOKBOOK_NAME -o .. --fail
    ```

    [knife spork](https://github.com/jonlives/knife-spork) is used here to bump
    our cookbook patch version on every build. It is important that you 
    bump your cookbook version before updating the cookbook dependencies (the next step)
    because the Berksfile.lock will also contain the cookbook version that have just been bumped
    in this step.

- Update cookbook dependencies

    ```shell
    rm -f Berksfile.lock
    berks install
    ```

    This step will ensure that you'll always be integrated with the latest cookbook dependencies
    based on the version constraints you have declared in metadata.rb.
    You will need to make sure that Berksfile.lock is deleted before you run `berks install`
    command. `berks install` will not update Berksfile.lock.

    You might ask why don't we just use `berks update` command in this step. The reason is because
    this command will require you to have Berksfile.lock
    to exist in your workspace, which is not necessarily true in a non-environment cookbook build.
    You can also run `berks install` then `berks update` on every build, but this will be a slower process
    as berks will take twice as much time to resolve your cookbook dependencies.

- Lint your cookbook: [cookstyle](https://docs.chef.io/cookstyle.html) and [foodcritic](http://www.foodcritic.io/).

    Adopt these tools early if you do not want to be buried in thousands of warnings later.
    These tools will help you find unintended bugs and enforce coding standards. These tools are essential
    if you do not have ruby background.

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
      to cache file downloads.
    - If your CI tool support matrix job, use them to test multiple platforms or test suites
      in parallel.

### Environment Cookbook Build

Earlier in this post, I mentioned that you'll have one git repository for every cookbooks you write.
There's an exception for *Environment Cookbooks* (again, read [this blog post][pattern] if you haven't read it already
to get a better understanding on this cookbook pattern). This cookbook sits beside your application
source code, hence two of the different project types sharing one build process.

Combining your environment cookbook and your application build (or application assembly build)
will allow you to promote and deploy
your application binaries and configuration files together.
This is important as you do not want these two things to diverge i.e. applying
the wrong version of configuration files to the wrong version of application in production due
to manual human intervention.

An example structure of a Maven project that contains an environment cookbook:

```
src/
  main/
    java/
cookbook/
  attributes/
    default.rb
  metadata.rb
pom.xml
```

On top of all the build steps in a normal cookbook build outlined in the previous section,
an environment cookbook build has additional build steps:

- The application build. This step will of course produce the binaries that
  you would be deploying with Chef.
- Updating cookbook cookbook/attributes/default.rb to point to your application version.

The attribute which Chef will use to determine which version of your application to be deployed
is stored in `cookbook/attributes/default.rb`.
Because they are kept together now in one repository,
you can update the `cookbook/attributes/default.rb` file to point to the updated version
declared in the pom.xml (after the pom.xml version is updated).

### Release Candidate

Every successful cookbook build should produce a release candidate, ready to be run to your targeted
environments. All the tests we have captured in the previous sections passed.

Here are the general steps that you should make after the build steps are completed to create a release candidate:

- Generate cookbook documentation
  
    At the time of writing, there are a lot of tools out there to document Chef cookbooks. Pick your own favourite,
    I'm using [knife-cookbook-doc](http://realityforge.org/knife-cookbook-doc/) because it allows
    cookbook attributes to be documented close to the source code. Other tools rely on the
    maintenance of `metadata.rb`, which often be overlooked when your source code evolves.

- Update metadata.rb

    Update the `source_url` in your metadata.rb to point to your build tag URL, which will be soon
    created in the next steps.

- Git commit: Commit those changes we made so far, including those done in the previous section.

- Create a new build tag

    Tag your commit with your current CI build number. These _build tags_ will later be used
    for promotion process. The tag naming convention that we are using here is build/[build number] e.g.
    build/100, build/101, build/102, and so on.

- Git push: Push your commit and build tag to your Git server.

- Chef server upload and version freeze
  
    Execute `berks upload` to upload and freeze your cookbook. It is crucial for the upload to happen last,
    because you don't want anybody to use cookbooks that didn't pass the tests right?

- Clean up

    Delete your old build tags based on your build retention policy. You might also want to clean cookbooks
    that are old enough and is not used by any environments. I personally have not done this as I
    have not seen the need of it yet, probably due to how good
    [Chef Server's Bookshelf](https://docs.chef.io/server_components.html#server-components)
    is handling thousands of cookbook versions we have.

### Chef Run

Once you have uploaded your cookbooks to Chef Server, you are ready to move on the next stage
of your deployment pipeline. The Chef Run phase will cover your environment configuration, application
configuration and application deployment. This phase must be automatically triggered when your environment cookbook build
is completed successfully. No manual intervention should be involved in this step unless
you are running the phase in production.

Using Acceptance Stage as an example target stage, here are the typical steps that will be executed:

- Download Berksfile.lock from a build tag (or release tag)

    In this step, you'll need to download the Berksfile.lock that has been
    committed to your environment cookbook build tag. You will need to find the newest build
    tag and then hit your Git Server to download that file. Because this deployment job will be triggered
    by its upstream build job, you can pass down the build number and that will the latest build tag
    that you would want to pull from.

    For example if Bitbucket Server used, you can hit the following API to download Berksfile.lock
    from build 100:

    ```
    https://bitbucket.example.com/projects/cd/repos/application/browse/cookbook?at=refs/tags/build/100&raw
    ```

- Lock the Chef Environment cookbook constraints

    ```shell
    berks apply application_acceptance
    ```

    Once the Berksfile.lock is downloaded, you would be able to excute `berks apply` to your acceptance
    environment without the full cookbook source code. This step is essential to ensure the consistency
    of your `chef-client` run in multiple machines.

    Note that `berks apply` will remove all of the previous cookbook constraints before applying a new one.
    If you have multiple applications that are deployed to one machine, you must have an
    environment cookbook that combines these two applications.

- Chef Run

    ```shell
    knife ssh "chef_environment:application_acceptance" "sudo chef-client"
    ```

    This step, of course, is the place where everything chef related would happen. On the deployment part
    of your recipe, you would download the application from your binary repository (with the version
    specified in your environment cookbook) then deploy them.

    The simplest execution of `chef-client` can be done from your CI server by excuting `knife ssh`.
    [Knife SSH](https://docs.chef.io/knife_ssh.html)
    would normally be sufficient when you only have one node to be executed at.

    Multiple nodes scenario would usually occur when your acceptance test environment is matured enough
    to match the production environments. When you
    have more than multiple nodes, I would recommend using
    [push jobs](https://docs.chef.io/push_jobs.html).
    You will suffer from knife ssh bad handling of status reports when hitting multiple nodes i.e.
    it is hard to determine the node has deployment failure.

### Smoke test

Your deployment will not complete without smoke tests execution. Smoke tests must be executed after every
chef-client run you make. The smoke tests you write should run fast to verify that your deployment
is successful, ideally in less than 1 minute.
They also should not involve any application data modification.

You have a couple of options to execute those smoke tests: [Serverspec](http://serverspec.org/) via Rake,
[Inspec](http://inspec.io/) via its CLI, or 
Inspec via [Chef Audit](https://docs.chef.io/analytics.html).
I'm using Inspec via Chef Audit even when it is not intuitively something that Chef Audit is
meant to be used for. This approach is good as you can use it in conjunction with push jobs
hence eliminating the need of establishing an SSH connection from your CI/CD server to your nodes.
You can enable chef audit mode in `client.rb` or a command line argument for `chef-client`.

Example smoke tests:

- Test the environment

    You can test various aspects of your environment here. Confirm that you can
    retrieve data from your database. `ping` or `curl` through every services that you are dependent
    on to make sure that there are up and making sure that the firewall is cleared.

- Assert the deployment status

    You can normally prompt web containers for the status of the deployment that you have
    just completed. For example in JBoss AS, you can query the status by using
    its cli tool and make sure that it doesn't
    return `FAILED` status:

    ```shell
    jboss-cli.sh --connect command="deployment-info"
    ```

- Assert the application version

    If you are deploying a command line application, check that `app --version` returns
    the correct version. If you are deploying a web application, make sure that the version
    written in the footer or somewhere in the web page has the correct version by `curl`-ing.
    You get the gist.

### Promotion to Production

This is the final stage of our deployment pipeline where the trigger of the phase is not automated.
You will need to make sure that your application binaries, application configuration, environment
configuration and deployment scripts to be tagged for reproducibility in the future. I will not be covering
application binaries promotion in this post as it's out of topic.

Based on the example deployment pipeline given above, this button will be the only manual step that
will be pushed in your deployment pipeline. The promote to production button will typically be pressed
after the acceptance tests and exploratory tests have passed.

If you have followed all of the previous chapters above, everything that we
need will have a single entry point, which is our environment cookbook. Here are the typical steps that
you would have:

- Promote the environment cookbook

    This step promotes our environment cookbook's git build tag to become a release tag.
    Basically if you have we are to promote build number 100,
    we are to make `release/100` git tag out of `build/100` git tag. This should be 
    achieved via REST API to avoid recloning your entire git repository.

    This step is necessary because your build tags will be deleted by your cookbook build once they
    are old enough.

- Promote all upstream cookbook dependencies

    Think about a disaster scenario that might hit your Chef Server. Would you be able to recover
    all of the cookbook dependencies that is needed by your environment cookbook? If you are confident
    that your Chef Server is resilient enough, you can skip this step, otherwise you will need
    to promote all of your dependencies found in your environment cookbook's Berksfile.lock. Failing to do so,
    you will not have any release tag for your upstream cookbooks.

    To lookup the upstream cookbook build tags based on your Berksfile.lock, you can hit Chef Server and
    query their metadata. This can be done by using `knife cookbook show` which would return `source_url`
    from your metadata.rb (This information would only be returned if you have followed the Release Candidate
    section correctly of course):

    ```shell
    knife cookbook show library-cookbook-foobar 0.1.1
    ```

    Once you have retrieved all of the upstream build tags, promote them the same way like how you have promoted
    the environment cookbook's build tag.


[pattern]: http://blog.vialstudios.com/the-environment-cookbook-pattern/
