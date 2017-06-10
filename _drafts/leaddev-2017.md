---
layout: post
title:  "Learnings from London LeadDev 2017"
comments: true
---

Here some of the things that I have learned during the [The Lead Developer 2017](2017.theleaddeveloper.com) conference, summarised.
I'm going to admit that I might have missed a lot of nuggets as my brain couldn't contain the amount of goodies
I found in the conference. I have also collected all of the resources mentioned by the speakers at the last section
of this blog.

# Software Development

At the peak of abuse of the Agile Manifesto, "We're Agile, We Don't Do Documentation" talk by @birgitta410 is right on point to recover
the importance of documentation. She and @anjuan had highlighted an important footprint that most of us missed in the Agile Manifesto:

> That is, while __there is value in the items on the right__, we value the items on the left more. - Agile Manifesto

Problem with this part of the manifesto is, it can be interpreted differently depending on which era you had entered the
software development world. The Agile Manifesto is created on the era where *heavy, thick and comprehensive* documentations/specifications
are created.

> Do not do documentation just for the process. - @birgitta410

Always, always ask the reason of why we are documenting our software. Done correctly, documentation will
spark a more efficient and effective discussion. When it's too comprehensive, people might not read it or
it even might be too complete for engineers to stop thinking creatively.
I can't help to highlight that this principle applies to everything that you do in software development:
*Do not do something just for the process*.

# Cultural Diversity

> Cultural Awareness is your job - @JillWetzler

There are a lot of tips from @JillWetzler on how you can be more aware:
- Sponsor people who are not like you
- Hangout with people who are not in tech
- If there are groups formed in your company, join them for awareness (you don't need to contribute)

Different people from different countries will have cultural differences. One of the metric
shared by @patkua is the Power Distance Index. I find this metric very interesting as I have worked in Malaysia
([PDI](https://geert-hofstede.com/malaysia.html))
and the UK([UK](https://geert-hofstede.com/united-kingdom.html)), which happen to have a very different Power Distance Index
and I can definitely relate to them.

How people interpret the result of performance reviews are also different in every country. @roidrage shared how
the Germans have a different performance review scale as compared to the US:
- German: Great, Good, Needs Improvement, Okay, Nope
- US: Great, Good, Needs Improvement (where 'needs improvement' equates to Nope in German)

Your family background will also contribute to cultural differences which outlined by @kwugirl as the
ask vs guess culture. It is important to note that neither is better than the other. This cultural
differences will affect your team communication.

Here is the definition quoted from [the original post](http://ask.metafilter.com/55153/Whats-the-middle-ground-between-FU-and-Welcome#830421):

> In some families, you grow up with the expectation that it's OK to ask for anything at all, but you gotta realize you might get no for an answer. This is Ask Culture.  
> In Guess Culture, you avoid putting a request into words unless you're pretty sure the answer will be yes. Guess Culture depends on a tight net of shared expectations.

# Engineering Culture

The engineering culture cultivated by @roidrage in Travis CI is an interesting one:
- All engineers are on call for production issues
- All engineers have the opportunity to support customers after a couple of months of joining the company

These practices help engineers feel both the successes of their contribution and the pain from real users.

Slack has zero tolerance for arrogance, as shared by @carlyhasreadhair. For everyone to grow
better, everyone needs to have the ability to not feel stupid. This is why they do not hire arrogant
people. Slack put empathy and respect to the utmost importance.y not to feel stupid.

# 1:1s

This section is mostly covered brilliantly by @adrianh. It's fascinating to find that most of the
methods he uses are actually coming from the User Research fields because no one has covered it
better! I have included the books
that he had recommended at the last section of this blog. The following is the dos and don'ts to help you
improve your 1:1:

| Dos | Don'ts | Notes |
|-----|--------|-------|
| Shut up (and listen) | "Wait" | It's common for people to wait for the opportunity to talk. Instead of listening, they are waiting for a gap. |
| Ask for stories | Ask about futures | 'Tell me about your worst day last week' vs 'Would you be happier if I give you a bonus' |
| Open question | Leading question | 'How can we help the QAs' vs 'Do you think TDD training would help the QA?' |
| Be polite | Be an asshole | Watch your body language. People know when you are not interested. They will not know that this is the fourth time you are hearing about the same problem |
| Write everything up | Trust your memory | 
| Analyse observation | Jump to insights | Separate insights and observations. What people tell you are mostly observations, not insights |

Approach

| Stalk, before you... | Observe |
| Talk, before you... | 1 : 1 |
| Sell, before you... | Find a solution |
| Build | Implement the solution |

# Giving feedback

Feedback structure from @jillwetzler
- Observation: Fact
- Impact: Outcome
- Expectation: "I expect someone at your level to ..."
- Assistance: offer support

## Don't be a hero
Don't be batman, be alfred

# Mentoring Juniors

@carlyhasredhair Junior biggest fear: Am I improving at the appropriate pace?


@rkoutnik Redefined career path for software engineers
implementer,
problem solver, problem finder. Find an article!

@JillWetzler Advocacy. People advance

70% stretch assignments
20% interaction
10% classroom

"Leveling up other is your job". Give stretched assignment.

@patkua
Eisenhower Matrix
Focus on Important but not urgent

# Software Development

@rogaladominika
year < 250 days
month< 20 days
week < 5 days

@saleandro
Use the strangler approach. better value delivery, values are delivered continuously. Identify bones, muscles, and fat.

A refactor a day keeps the rewrite away.

# Personal development

@mariagutierrez

Personal time
1 full day a year to plan. Balanace your learning to tech, people and business.

# Resources

| Source   | Reference | Link |
|----------|-----------|------|
| @patkua  | StrengthsFinder 2.0 | [Book](https://www.amazon.co.uk/d/cka/StrengthsFinder-2-0-Upgraded-Online-Gallups-Discover-Strengths/159562015X) |
| @kuwgirl | Congrats! You're the tech lead. Now what? - Eryn O'Neil | [Video](https://www.youtube.com/watch?v=FcyD85z3JSI) |
| @adrianh | Interviewing Users | [Book](https://www.amazon.co.uk/Interviewing-Users-Uncover-Compelling-Insights/dp/193382011X) |
| @adrianh | Practical Empathy | [Book](https://www.amazon.co.uk/Practical-Empathy-Collaboration-Creativity-Your/dp/1933820489) [Audio](http://www.audible.co.uk/pd/Business/Practical-Empathy-Audiobook/B01M5GFWDK) |
| @catehstn | Engineering Manager Slack Group | [Link](https://engmanagers.github.io/) |
| @birgitta410 | ADR Tools | [Github](https://github.com/npryce/adr-tools) |
| @birgitta410 | The back of the napkin | [Book](https://www.amazon.co.uk/Back-Napkin-Solving-problems-pictures/dp/9814382248) |
| @roidrage | Open Organization | [Book](https://www.amazon.co.uk/Open-Organization-Jim-Whitehurst/dp/1625275277) |
| @roidrage | Turn The Ship Around | [Book](https://www.amazon.co.uk/Turn-Ship-Around-Building-Breaking/dp/1591846404) |
| @jillwetzler | Female Career Advancement Summed up in One Useful Diagram | [Video](https://www.youtube.com/watch?v=SDIV8XV6Qrg) |
| @lara_hogan | Demistifying Public Speaking | [Book](https://www.amazon.com/DEMYSTIFYING-PUBLIC-SPEAKING-Lara-Hogan/dp/1937557529) |
| @patrikkarisch | The Accessibility Machine | [Github](https://github.com/liip/TheA11yMachine) |