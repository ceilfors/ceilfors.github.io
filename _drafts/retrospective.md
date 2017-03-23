---
layout: post
title:  "7 Years in Retrospect"
comments: true
---

After working for 7.5 years for Experian, I'm finally moving on to the second job of my life.
I'm capturing the learnings and observation throughout that years here, something
that I'll be able to look back on to remind myself in the future. I hope it is useful
to you too.

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
why I got my job in the first place.

# You don't get what you don't ask (ask with data)

I had met colleagues who would complaint about how underpaid they are.
The innocent me would ask, "Why don't you ask for more?". More often than not, the answers
I'd get back is:

> "That will never happen."

There are way too many people I met whom somehow expect good things to just happen.
They would work hard, then just expect people to notice what they've done without
telling anybody. In an ideal world, yes, you will get feedback or rewarded, but most of
us will not have that luxury. I would like to think that this issue correlates again
to the fact that us programmers are mostly introverts. 

Now, I don't claim to be a negotiation guru, but the simplest thing you can do is just
go into your one-to-one meeting and say:

> "I'm feeling underpaid."

There are definitely better ways of getting a raise, but the problem in the first place
is you, thinking that your manager is a psychic who are capable of reading your mind
and figuring out what you want.
Be reasonable of course, it only works when you think that you have
given more than what the company gives you.

Looking back, I have also switched my role to become a build engineer because
I asked for it. Initially I only asked for a part time role as I figured that
there are a lot of problems that can be solved with my software engineering expertise.
I was then involved in the existing team for half day per two weeks for a few months.
After I have provided enough data
and evidence that I'm suitable for the role, I asked for a full time role change.
After the role change, I also asked for my job scope to be changed by
including more *engineering* and reducing *administration* tasks. I gathered data from the internet
on various companies' build engineers job description then ask for the change.

# The power that's left unused

Many of us have little knowledge of what the management team is
responsible for. We know that they are there to *manage*, but we do not know what
there is to be *managed*.

> The manager’s function is not to make people work, but to make it possible for people to work.  
  ― *Tom DeMarco, Peopleware*

To be a good manager, you'll need to understand *flow*, the hard-to-gain state where a knowledge workers
would be able to get complex works done. It is the development managers' job to ensure that all of the engineers
are able to enter the flow state.
It is too easy for you to be unsympathetic about no-flow problems if you are a manager,
because you work in interrupt mode; because you don't need flow. You will need to be
more observant of the office environment. When you see an engineer wearing an earphone,
maybe he's wearing to enjoy music, maybe the office is too noisy. All of the engineers will love you
when they can get their daily dose of flow. Use your power.

I once heard from a manager about how surprised he were about
a team that is incapable of focusing on their work due to the high number of disruptions
occurring in the day. Now the sad thing is, after a couple of months
of working, he eventually said that this problem is not solvable as it is a cultural issue.
This is another example of an unused power. It is not this particular manger's fault
of course, it's not something changeable by someone on his pay grade.
Ultimately if a change of culture is needed, the C-Suite must be the one who initiated it.

Often times, I struggled to work with another department due to the conflicts of interests and priorities.
Our manager went on an discussion with the other department's manager. Of course, there's no result.
The two departments have a different goal, which is reflected in their KPI.
Someone somewhere would have used the unused power, to set the common goal in the first place.
That would make the collaboration effortless.

# The trivial mistakes on team structure

I've worked with multiple teams throughout my career, some of the decision mistakes
we made now look very trivial but shamefully still happened.

Placing multiple stakeholders with different interests and priorities in a team will not work. There is a reason
why a team should be composed of one, instead of many, product owner.

For a team to jell properly, all of the team members must be 100% allocated to the team.
When everything is important, nothing will be important. One team member's failure of commitment
will lead to the whole team's failure of commitment. The not-100% team member will also have
multiple stakeholders, see the previous paragraph.

A remote team would work if all of the team members are all self-motivated. There are a lot
of things that you won't be able to do otherwise co-located.
Of course, all of the above must be satisfied.

Fragmentation of time zones in a team is not the most painful part of a remote team,
cultural differences are. Work hard to adapt yourselves.

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
easy for people to neglect the value of what we are trying to deliver in the first place and
blinded by the perfect vision.

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
