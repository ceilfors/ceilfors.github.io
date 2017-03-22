---
layout: post
title:  "7 Years in Retrospect"
comments: true
---

After working for 7.5 years for Experian, I'm finally moving on to the second job of my life.
I'm capturing the learnings and observation throughout that years here, something
that I'll be able to look back on to remind myself in the future. I hope it is useful
to you too.

# The battle for a walking skeleton
![Walking Skeleton]({{ site.url }}/assets/image/skeleton.gif)
*gif is copied from [this codeclimate blog](http://blog.codeclimate.com/blog/2014/03/20/kickstart-your-next-project-with-a-walking-skeleton)*

A walking skeleton would work well in various aspects of software development.
It would work in feature developments, deployment pipeline creation, or infrastructure
migration. Pretty much anything that you can think of.
Creating a walking skeleton is about implementing the smallest possible amount of work to get
all of the important elements in place, *end-to-end*, then move all of those elements
in parallel together. Slicing user stories vertically, prioritising the slices, and separating
concerns are the key for a successful walking skeleton. Based on my experience,
these practices have proven to be hard, if not requiring a mastery.

The tendency of a new requirement is a running skeleton with gold plated feet.
This is fine until an inexperienced team is breaking down requirements to user stories
horizontally without realising the implications.
Sometimes people just forget about the meaning of a *user story*, it is not
a synonym for a task. Be more observant and raise your concerns when these happens.

Slicing vertically can also be applied in a implementation of a deployment pipeline.
Unfortunately the tasks you might be assigned to might only be gold plating your build
pipeline before you move on to your deployment, which will delay the simplest
implementation of an end-to-end deployment pipeline.
One of the concrete example I'd like to share is my experience in automating
our deployment. The requirement is simple: we would like to be able to a trigger
deployment to multiple production servers with a push of a button (no prior automation had been done).

Sounds simple right? Nope.

First, you'll have security and compliance concerns because
your CI/CD server will need to be able to establish remote connections to all of your production servers.
Believe it or not, we finally didn't implement any button in our CI/CD server after we sliced the requirement down.
The value of automating the deployment process itself has already brought 80% if not 95% of the value;
the script is then triggered manually by the Ops that already has access to the servers. The button
requirement can now be de-prioritised. Second, you'll have a purist
telling you that it is unacceptable to SSH to each of the servers manually and execute the script
and how necessary it is to have the button. Again, slicing the requirement down, the Ops can
write a simple command to SSH to multiple servers to execute the command remotely. It is too
easy for people to neglect the value of what we are trying to deliver in the first place and only
focused on the perfect vision.

Mastering all these practices are not the end of the game. You'll have to convince
your stakeholders and product owners. I've met stakeholders who believe that the skeleton
legs must be able to run forever before you are developing its skull.
Creating a walking skeleton would also mean that you are laying out the invisible
foundations upfront (slower initial progress) which would make the stakeholders feel
uncomfortable if your team is delivering the very first
feature. Explain the benefits they will get in the
longer term and manage their expectations right.

One final thing to note, one of the success indicator is a constant change of priority.
Your stakeholders will be a priority changing addict. Make sure that you don't leave technical debts
behind. They will not realise what you have done to the business,
which is reducing a huge opportunity cost in the long run.

# Don't hide your passion
Most of us live in a non-programmer-friendly society.
We have words like geek or nerd which have negative connotation to dis programmers. You are socially
expected to have 'life' after work. Of course, programming is not counted as 'life'. On the other hand,
most of the programmers I know are introverts, meaning they are quiet and will naturally not talk
about their passions. These two factors cause a vicious cycle which worsen our society.

To break that vicious cycle, we who have passion in programming, should break out of our introvert bubble.
Talk about your passion more and don't be shy saying what you are doing at home.
You might not change the society much, but you would inspire the others who love
programming to do the same. There are
a lot of good things that wouldn't have happened in my career if I did not show my passion.
I've got to know a lot of good programmers. I 
met passionate managers who have kindly given me guidance. Heck, it might be
why I got my job in the first place; Experian does not hire fresh graduates.

# You don't get what you don't ask
- role
- salary
- job scope
- It should be more natural for us programmer to negotiate with data?

# The recipe to fail
- Multiple stakeholders
- team allocation, 100%, no commitment
- Fragmentation of time
- Bureaucracy
- You can do things remotely, only with the best people.

# Productivity
- 15 mins rule, save people time: when you're stuck on something ... you have to try to solve the problem all by yourself for 15 min, but then when the 15 minutes are up you have to ask for help. Failure to do the former wastes people's time, failure to ask for help wastes your time.
- Set your own deadline
- Importance of work prioritise
- Work in batch.

# Reactive Management
- Difference between alignment and micro management. If your team is not deviating, you achieve 101 micro management
- jargon abuse: cross functional team recently
- change of priority
- theory of constraint
-- the phoenix project e.g. microservices
- High performing manager, neglecting their reporting lines
- accountability, focus on management
- Hiring: Find Dev who loves business challenges, not having fun on tech

# Value Chain / Impact
- Open Source
- Stack overflow
- If you write more than once, write a blog

Career capital
- Switch of build engineering
- Self organization
- Related to productivity?
