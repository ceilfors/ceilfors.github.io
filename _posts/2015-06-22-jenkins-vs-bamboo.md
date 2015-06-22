---
layout: post
title:  "Jenkins vs Bamboo"
tags: subversion svn python
comments: true
---

*Disclaimer: I have 1 year experience with Jenkins and 0 experience with Bamboo, so I might be wrong on certain points Bamboo. Open for feedbacks in the comments.*

We have just adopted Stash in our infrastructure, that means another Atlassian product adoption. There are motivations to sync up all of our infrastructure to use Atlassian products because they are known for their seamless integration. This research is done to explore the possibility of replacing Jenkins with Bamboo.

## Atlassian applications integration
*Winner: Bamboo*

As an Atlassian product, Bamboo wins the fight hands down. It integrates with JIRA, Stash and FishEye seamlessly. All of the connections are maintained consistently in application links like any other Atlassian products. You can find the massive list of integration features [here](https://confluence.atlassian.com/display/BAMBOO/Integrating+Bamboo+with+Atlassian+applications).

Jenkins has rough edges here. Jenkins can integrates [with](https://wiki.jenkins-ci.org/display/JENKINS/JIRA+Plugin) [JIRA](https://marketplace.atlassian.com/plugins/com.marvelution.jira.plugins.jenkins), [Stash](https://github.com/palantir/stashbot) and [FishEye](https://github.com/kpfleming/jenkins-git-plugin/blob/master/src/main/java/hudson/plugins/git/browser/FisheyeGitRepositoryBrowser.java) as well but they are all maintained separately as a plugin. I would say most of the important features are available, but they are not implemented *prettily*.

The below are the integration features that we think are important in Bamboo and see how it's being supported in Jenkins.

| Product | Integration feature | Jenkins support |
|---------|---------------------|-----------------|
| Stash | Stash tells Bamboo when to build | Yes. Can be done by poll out of the box. Push trigger requires plugin config: [webhook](https://github.com/Nerdwin15/stash-jenkins-postreceive-webhook) & [stashbot](https://github.com/palantir/stashbot) |
| Stash | Stash tells Bamboo when to update plan branches to match changes in repository branches | Yes. Use job-dsl-plugin to hit Stash REST API. workflow-plugin claims to support this as well.
| Stash | Stash commits are displayed in the relevant Bamboo builds | Yes. Supported out of the box by Git Plugin. |
| Stash | Bamboo notifies Stash automatically about build results | Yes. Supported via [stashNotifier](https://github.com/jenkinsci/stashNotifier-plugin). It’s hitting [Stash API](https://developer.atlassian.com/stash/docs/latest/how-tos/updating-build-status-for-commits.html). |
| JIRA | Deployment Panel | No. We can use JIRA REST API to add a comment at the very least. |
| JIRA | Viewing build results in JIRA | Yes. Supported by a [Stash plugin](https://marketplace.atlassian.com/plugins/com.marvelution.jira.plugins.jenkins) or a [Jenkins plugin](https://wiki.jenkins-ci.org/display/JENKINS/JIRA+Plugin). |

## UX and UI Features
*Winner: Tie*

The user experience quality of Bamboo is very good. First of all it's consistent with the rest of the Atlassian products. For a first time user of Bamboo, I manage to understand most of the features and it's guiding you through all of the process of creating a new plan nicely. Atlassian documentations are very good for beginners as usual. The feature that I'm most impressed about is how it treats [deployment as first class](http://blogs.atlassian.com/2013/07/release-management-jira-bamboo/). The concept of Stage that replaces Jenkins downstreams are also very nice. Bamboo also has multiple branch build support out of the box. All of these requires manual configuration in Jenkins.

Bamboo fall short on some common tasks e.g. it [can't display Cobertura report](https://jira.atlassian.com/browse/BAM-13180). The parameterized build can't be forced and [can only be run via *Run customized*](https://answers.atlassian.com/questions/12316/is-it-possible-to-prompt-the-user-for-input-with-bamboo).

Jenkins UX on the other hand has a steeper learning curve and setup. Though once you are used to it, you will gain more features from it's vast amount of plugins. Everybody knows that Jenkins UI is ugly though it's been improving over time with the [recent versions](http://jenkins-ci.org/content/user-interface-refresh). The CSS is also configurable with a theme though that will not fix the entire UX.

Jenkins can only be complete with its plugins. Basic features are readily available out of the box and overlooked by Bamboo. For example customizing maven settings.xml via UI configuration. Or clearing down workspace which is very handy when they are dirty. Also for the downstreams, Jenkins has a Build Pipeline plugin that provides a full blown view on how the jobs are connected, this is all missing in Bamboo.

However due to it's vast number of plugins, it can be a daunting task for a beginner to figure out which plugin actually works. A wrong combination of plugins might break your build as well. It will take time for the users to be familiar with the interface. Because the plugins are developed freely, some of them are having inconsistent UI.

## Maintainability
*Winner: Jenkins*

Jenkins has [job-dsl-plugin](https://github.com/jenkinsci/job-dsl-plugin) and [workflow-plugin](https://github.com/jenkinsci/workflow-plugin). These two plugins enables build engineers to orchestrate Jenkins with Groovy DSLs (and templates). All of the DSLs can be stored in VCS and changes can be properly audited and reverted if needed. job-dsl-plugin also supports job templates which reduce a lot of manual configurations. The other big win is that we can attract simple change to be done by developers because it's all Java/Groovy code. Besides the DSL, Jenkins has a script console where the build engineers can execute any arbitrary Groovy scripts to configure the jobs. You can even execute these scripts remotely from your favourite IDE.

[Not supporting template](https://jira.atlassian.com/browse/BAM-13600) is one of the reason users move away from Bamboo. Bamboo however, has [Bamboo CLI](https://marketplace.atlassian.com/plugins/org.swift.bamboo.cli) to overcome it's bulk change limitation. Bamboo CLI interacts with bamboo remotely with a series of command lines execution. Even though you can add an arbitrary task with this tool, [it's very hard to determine](https://bobswift.atlassian.net/wiki/display/BCLI/Examples+for+AddTask+Action) how to add a new task with it hence lacks of flexibility.

Jenkins stores it's configuration and build result as XML, Bamboo is storing them in RDBMS. The XML approach makes Jenkins very flexible and portable. You can easily migrate Jenkins jobs across multiple instances just by copying the configuration. You [can't do this in Bamboo](https://jira.atlassian.com/browse/BAM-1223). Storing the configuration in XML has enabled Jenkins to be configured if they are not available in the UI such as reseting build number that [Bamboo can't do](https://jira.atlassian.com/browse/BAM-10282). Also some of the system administrators who are more confident with their sys admin skills can configure the jobs by changing the XMLs directly.

## Scalibility
*Winner: Jenkins*

To scale out CI servers, more remote slaves are needed. The more agents or slaves you have, the more horizontally scaled you are. Bamboo license are priced per remote agents. You can have unlimitted amount of slaves in Jenkins OSS. Jenkins enterprise are priced per slaves as well.

[The steps](https://confluence.atlassian.com/display/BAMBOO/Bamboo+remote+agent+installation+guide) to configure the agents in Bamboo are quite hefty. There's no automatic install of the tools hence you will need to invest in other configuration management tools e.g. ansible, chef or puppet.

Jenkins wins here with the ease of spinning up a new remote agent/slave. You can literally use any empty machine as a slave without any setup. The slave are configured via Jenkins UI and all of the tools can be installed automatically. This is an out of the box feature from Jenkins. It also go to the extend of utilizing unused computing power with [Swarm Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin). This plugin enables automatic slaves discovery nearby Jenkins master.

Shall you be moving to SaaS model for the entire company, a well separation of concerns in between jobs are very important. Bamboo does a very good job here by by having the concept of [projects](https://confluence.atlassian.com/display/BAMBOO/projects+in+Bamboo) and plans. One project has multiple plans, one plan has multiple jobs (and stages). With this concept, you will be able to support multiple projects well in Bamboo. Sleek!

Jenkins does the separation of jobs with folders or views, which is not as integrated as Bamboo's concept of project. A common alternative would be for the individual teams to have their [own Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Consideration+for+Large+Scale+Jenkins+Deployment). We are definitely moving away from SaaS model if we do this, that's why CloudBees has [Jenkins Operations Center](http://pages.cloudbees.com/rs/cloudbees/images/Jenkins-Operations-Center-by-CloudBees.pdf) to manage multiple master nodes.

It is important to have your CI server with High Availability as we can't afford down time if our CI server is being used by multiple global teams. Bamboo doesn't support high availability/fail over out of the box, but you can [achieve it traditionally](http://www.nicholasmuldoon.com/2013/07/bamboo-in-a-high-availability-configuration/). This is a [first class support](https://www.cloudbees.com/products/jenkins-enterprise/plugins/high-availability) by Cloudbees in Jenkins enterprise.

When a software grows, a software will need to be tested in a matrix of platform e.g. multiple databases, webservers, jdk, etc. Jenkins supports Matrix project configuration. Configure one job, and the job will be executed repeatedly in all of the platform matrices configured. This is [not](https://answers.atlassian.com/questions/27892/bamboo-multi-configuration-plans) [supported](https://answers.atlassian.com/questions/218887/what-is-the-bamboo-equivalent-of-a-jenkins-matrix-job) in Bamboo.

## Upgrade steps
*Winner: Jenkins*

Bamboo has a clear upgrade documentation though too hefty as compared to Jenkins. You need to do a backup for all of the home directories, babysit the update process and monitor the log files. Bamboo may also require a reindex after the upgrade.

What's not easier than dropping a war to tomcat? Jenkins is clearly a winner. Jenkins doesn't change your XMLs during the upgrade as the communities are crazy about backward compatibility. Not happy with the later version? Drop in the previous war. When you are happy with the new version, there is a click of a button away from updating all of your configuration to the latest model.

## Job market and adoption rate
*Winner: Jenkins*

#### Company adoption
- [Jenkins list here](https://wiki.jenkins-ci.org/pages/viewpage.action?pageId=58001258)
- [Bamboo list here](https://www.atlassian.com/company/customers/customer-list/?tab=bamboo)

#### Last year's [Infoq poll](http://www.infoq.com/research/ci-server):
- Jenkins adoption rate 85%
- Bamboo adoption rate 68%
- Heatmap shows that users are steadily using Jenkins, while there are some heat spots of people moving away from Bamboo.
- More details in the link.

#### [Indeed job trends](http://www.indeed.com/jobtrends?q=bamboo%2C+jenkins&l=)
- Jenkins growth is consistent and spiked last year.
- Bamboo growth spiked up and down after a couple of months last yeare.
- Jenkins has 8543 jobs posted.
- Bamboo has 1496 jobs posted (including some [non relevant jobs](http://venturefizz.com/jobs/human-resources-generalist-at-virgin-pulse-framingham-ma?utm_source=Indeed&utm_medium=organic&utm_campaign=Indeed)).

## Price and support
*Winner: Jenkins*

Bamboo is a commercial software. Jenkins comes with two flavors, free and enterprise. The commercial support of Jenkins Enterprise comes from Cloudbees. The price can't be compared here as Cloudbees is not displaying the price in their site.

Both Jenkins and Bamboo have numerous bugs and you will definitely run into problems. Because Jenkins is open sourced, you are much more likely to have a workaround from the community until it's fixed. You are stuck in Bamboo with Atlassian support. One of the biggest example is the [build template](https://jira.atlassian.com/browse/BAM-13600) ticket in Bamboo that raised 2 years ago with 99 votes now. In Jenkins, the plugins are supported by the community.

Besides support, Bamboo product naming makes it [less Google-able](https://www.google.co.uk/#q=bamboo%20scale).

## Summary
Bamboo is easy to use, good looking and has good Atlassian integration. Jenkins is rough around the edges, but far more flexible than Bamboo. When Jenkins is running standalone, it's obvious that it's far more superior than Bamboo. Bamboo shines when it's placed with other Atlassian applications with its good UX.

The decision of the adoption should fall down on the stakeholders priorities. Is integration more important? Is maintainability and scalability more important?
