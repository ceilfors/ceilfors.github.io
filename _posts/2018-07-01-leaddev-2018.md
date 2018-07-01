---
layout: post
title:  "Thoughts and Learnings from London LeadDev 2018"
comments: true
---

This post captures my thoughts and learnings from
[The Lead Developer 2018](https://london2018.theleaddeveloper.com/) conference.
They are split into five sections and sorted in arbitrary order, and the last one
is some of the interesting resources I've collected from the talks.

# No one knows your job, except you

> Always read the job description - _@danpersa_

You are supposed to code. No, you are supposed to embrace the life of no coding. I think, you are too busy
lately in meetings and not spending enough time with the team. Enough, you are coding too much.

If you have been in a Tech Lead position for quite some time, you should be very familiar
with this problem. Everyone around you will a different expectation on
what your role should be, and I'm not only talking about the coding expectation of your role.
@danpersa talked about the importance of reading your job description. Company A
might see Tech Lead as an Engineering Manager, Company B might see Tech Lead as a Lead Developer,
Company C see Tech Lead as an Architect. This is especially a good tip if you are looking for a new job.

You should also manage your colleagues' expectation when faced with this kind of problem.
@kevingoldsmith shared a good tip on how you can do this:
brainstorm with your colleagues with sticky notes to create a
_joint working agreement_, on your first 1:1. Share the expectations the two of you have on
each other during the brainstorming session. At the end of the session,
go through each card and make sure that a common understanding is reached.

> The higher up you go, the fewer people will tell you're messing up.
> You become the person most equipped to know what's going wrong and fix it.
> So how to know when you're messing up? Self-awareness
>
> _- @aliciatweet_

Feedback, feedback, feedback, it goes without saying and almost every speakers
reiterated the importance of feedback. I highly recommend you to gather feedback on every 1:1s.
Sometimes feedback can only do so much, which is why @aliciatweet talked about
the importance of self-awareness.

# The cost of improvements that no one talks about

In the effort to improve a team, process improvement has always been the lowest hanging fruit.
It is very easy for you to start from a process improvement, but always keep an eye of the
negative impact it might cause to your team.

> "Pairing/Mobbing by default all increased throughput.
> But, they also all increased team friction. After too much friction, it wasn’t fun any longer."
>
> _- @pia_nillson_

This is why I find @pia_nillson's talk to be very interesting. She suggests that optimisation of work
correlates with higher team friction, which makes a lot of sense! Pairing forces you
to communicate with your pair for the entire day. Limiting WIP will force multiple pairs to collaborate
on a shared end-to-end story. She recommends a couple of antidotes,
each of which worth Googling for:

1.  Psychological safety: Confidence I won’t be blamed or laughed at if I make a mistake.
    Ask stupid questions, "I think this sucks" > "This sucks", appreciation in retrospective.
2.  Active listening: Don't interrupt.
    "Yes, and" technique to build on others’ idea
3.  Friendly feedback: Non-Violent Communication.
    Turn up the Good: Focus on what’s going well and turn that up (retrospective)
4.  Answer Why: Purpose of the team.
    OKR, Goal must not have the solution, "Despicable design"

The other type of improvements that you might want to have on a team is a technological
improvement. New technologies, aren't they exciting? Containers are still on the rise
and a lot of teams want to adopt them. "Containers need headcount", said @alicegoldfuss.
This should be quite an eye-opener for a team that wants to build a container platform.
The list of skills that she thinks is required to set up a team to make this happen (yes, a team is required):
operations, deployment, monitoring, networking, kernel engineer, infosec, internal adoption,
project manager. You should at least have 4 people, with a maximum of 8 people on the team.
There is no such thing as a free lunch.

# Countering distraction with a clear goal

A couple of speakers briefly talked about how a team is never static nowadays.
There is always a change in a team that causes a _distraction_. This change can be due
to various reason such as a team member change, a senior leadership change, a priority change,
reorganisation, or even just a desk move.
It is therefore important for a team to always be prepared for a change.

> Define a single clear goal.
>
> _- @jenny_duckett_

It is too easy for developers to lose the big picture when they are focused
on solving a specific problem. Regardless of the type of the distraction
your team is facing, this problem must be counteracted by defining a team's goal.
Regularly show how your team's work fits into the bigger picture and relate it
to the team's goal. As per what @danpersa said, you must unlearn the principle of DRY in this
context, repetition is key! A specific process of setting a goal can be adopted
from Google, it's called OKR (as covered in the previous section).

The goal that you are trying to achieve as a team should also be aligned with
delivering real values to your users or customers.
There is no point in achieving a goal that does not deliver business values, nor it
is helpful to counter team's distraction.

> BIN, THIN, SPLIT - we have smaller stories - but they still deliver values.
> Talk about value, not size or effort.
>
> _- @adrianh_

People who have worked with me will often hear me say "Cut the fat, trim the muscle,
delivery the bone". This similar to what @adrianh has recommended, except for the fact
that it's less horrid:

1.  Can we BIN it - do we need to do it?
2.  Can we THIN it - take a story and make it less? Can we build the 20% that delivers 80% value?
3.  Can we SPLIT it - to more than one story that provides customer value?

# The growth of others, and yours

> A gardener doesn't tell plants how to grow.
> They create the best environment for plants to flourish,
> but you still need to know how to garden and what to weed out
> _- @aliciatweet_

The last section but not the least. Most of the conference attendees were probably
interested in upskilling themselves. Fortunately, a lot of speakers have reminded us
that growing others are equally important, and that's part of your job.
There are different levels of developer that you can help grow. They are
interns, juniors, experienced, and yourself. Let's start with the interns and the juniors.

> You can invest your time, create opportunities, and give feedback
> _- @tara_ojo_

It's quite a revelation to hear from @WebDevBev on how difficult it is
to get into tech industries. She couldn't join apprenticeship as she owns a non-tech
degree. The apprenticeship system excludes people with any degree. She couldn't join
a boot camp as it will cost her £8000. She couldn't join an unpaid internship,
as she has a dependant. If you have an intern on your team, it goes away saying,
invest your time while the intern is on your team.

@tara_ojo has conveniently shared practical tips on how you can invest your time
to grow interns and juniors:

1.  Stretch them. I always used the Goldilocks principle, or shoe sizing
2.  Keep track of their achievement, this will help with their promotion
3.  Pairing, give them the keyboard
4.  Give feedback, regularly

> Don't praise the knowledge, praise the thirst for knowledge
> _- @ClareSudbery_

There is a reason why @ClareSudbery has dedicated an entire talk on the growth of
experienced developers, because it is hard. She reiterated the significance of empathy,
which should not be excluded even for experienced developers. One of the key takeaway for
me is on the tips for _praising_. On my entire career, it is very rare (probably never) for me
to praise other developers as I need developers to continuously be curious and learn
based on their intrinsic value. You don't want a developer to do something
just to be praised by someone. Which is why what she said on praising struck me, I'll
definitely give it another thought.

> Leading takes energy, and you can't lead when you are burnout or ill.
> _- @cmccarrick_

Now, back to you. I won't be covering much here except for the fact that the speakers who
are sitting on the higher-ups (above Lead developer role) were talking about health. These speakers
were @cmccarrick (SVP of Platform Engineering) and @aliciatweet (VP of Engineering). In simple words,
if you are looking to step up your career, be also ready to step up your stress handling skills.
The unanimous tips to handle and recover from stress
were regular meditation and regular exercise. Yes, I repeated the word _regular_ twice.

That's all for now, good luck!

# Resources

> Reading is important too - a lot of successful people credit reading - @cmccarrick

| Source         | Reference                                    | Link                                                                                                                       |
| -------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| @pia_nillson   | Love 2.0                                     | [Book](https://www.goodreads.com/book/show/15808839-love-2-0)                                                              |
| @jenny_duckett | Our top 12 mob programming tips and thoughts | [Blog](https://gdstechnology.blog.gov.uk/2016/09/08/our-top-12-mob-programming-tips-and-thoughts/)                         |
| @cmccarrick    | Thanks for the feedback                      | [Book](https://www.goodreads.com/book/show/18114120-thanks-for-the-feedback)                                               |
| @cmccarrick    | Google's Manager Feedback Survey             | [Tool](https://rework.withgoogle.com/guides/managers-give-feedback-to-managers/steps/try-googles-manager-feedback-survey/) |
| @cmccarrick    | Deep Work                                    | [Book](https://www.goodreads.com/book/show/25744928-deep-work)                                                             |
| @adrianh       | User Story Mapping                           | [Book](https://www.goodreads.com/book/show/22221112-user-story-mapping)                                                    |
| @nmeans        | The Field Guide to Understanding Human Error | [Book](https://www.goodreads.com/book/show/376964.Field_Guide_to_Understanding_Human_Error)                                |
| @aliciatweet   | How depression made me a morning person      | [Blog](https://betterhumans.coach.me/how-depression-made-me-a-morning-person-cda4889662ff)                                 |
| @ramtop        | Kintsugi                                     | [Wiki](https://en.wikipedia.org/wiki/Kintsugi)                                                                             |
