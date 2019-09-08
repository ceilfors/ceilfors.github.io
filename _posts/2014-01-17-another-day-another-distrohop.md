---
layout: post
title:  "Another day, another distrohop"
tags: linux
redirect_from:
  - /2014/01/17/another-day-another-distrohop
---

Ubuntu, Linux Mint, Arch Linux, ArchBang, CrunchBang, and finally I did another distrohop to Debian. I don't think I'm one of those [proud distrohopper][distrohopper] yet with this hop. Though my first few hops was quite intensive, CrunchBang has made me stayed for almost [6 months][crunchbang-first-post]. I'm also not in a quest to find a [perfect distro][urban]. What I really want now is just a **stable enough** distro. I need to balance getting things done and learning Linux. That's what the hop is all about. 

### Before Debian
Before I switched to Debian, I was a happy user of CrunchBang. Great community, groovy speed and very lightweight. A fresh boot only consumes roughly about 200 mb of my RAM. As a matter of fact, I will use CrunchBang if I need other Linux machine. So why is the hop?

### Living on the bleeding edge
I switched to [Debian sid][sid] in CrunchBang to live on the bleeding edge. The more problems I fix, the more I have learned. Unfortunately some of them just couldn't be fixed. Heck, or you can say that I had given up. I learnt a lot from the community in CrunchBang's IRC, but this time the response is:  

> Are you using sid? You have to wait a little bit longer, son.

These are a couple of issues that annoyed me the most everyday:

- After a couple of times resuming my machine from _suspend mode_, I will get a constant freeze every 1 or 2 seconds. I have to restart my machine to fix this. That's means I can't suspend my machine!
- SLiM gives me issues too. After I logged in, Openbox is just not responding to me. Only my wallpaper is shown. Using a login-shell was the workaround. Therefore, my booting up ritual is: 1) Go to Virtual terminal, 2) login, and 3) startx. Ugh.

With those two of the above combined? A hop indeed. Some of the issues are happening because I did not RTFM properly too. I'm guessing that I did not apt-pin my packages properly. For my future self, [read all of this][crunchbang-sid] next time!

[urban]: http://www.urbandictionary.com/define.php?term=distrohopper
[crunchbang-first-post]: http://crunchbang.org/forums/viewtopic.php?id=27605
[crunchbang-sid]: http://crunchbang.org/forums/viewtopic.php?id=16353
[ord]: http://www.xda-developers.com/announcements/do-you-have-obsessive-rom-updating-disorder-ord/
[sid]: http://www.debian.org/releases/sid/
[distrohopper]: http://jimlynch.com/linux-articles/the-psychology-of-a-distrohopper/