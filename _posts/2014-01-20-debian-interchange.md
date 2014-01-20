---
layout: post
title:  "Debian Interchange"
tags: linux
---

This post contains all of the ritual I had done during my
[distro installation][prev]. I'm using HP DV3-2111TX laptop.
Though this laptop is not a [Ubuntu Desktop certfied hardware][ubuntu-certified-list],
I don't encounter much firmware issues.

## Switch distribution
It didn't take me long to switch to [testing distribution][testing]
after some of the packages I need are not available or outdated in *squeeze*
e.g. gradle, android-tools-fastboot, android-tools-adb, etc.

During my way to find the fastest Debian mirror,
I found that apt-spy doesn't work OOTB like before. It is
looking for some mirrors txt file to no avail. Maybe it's
not mainted anymore. I was using [netselect-apt][netselect-apt]
to find the festest mirror instead. Works like charm.

## Audio
As usual, I need to cure my loyal patient, PulseAudio. This guy
is ill on the current  stable and testing distributions. ArchLinux's
Wiki is always my best friend here. It has a long list of well
maintained [PulseAudio troubleshooting guide][arch-pulseaudio].
Just look at that fat table of contents!

On *squeeze*, I had crackling / buzzing sound when an audio
starts playing. I fixed this by turning off [the timer-based scheduling][arch-tsched].

After switching to *jessie* (the testing distribution as of now),
my audio volume is randomly jumping to 100%! Thanks to ArchWiki again,
[disabling the `flat-volumes`][arch-jump] fixes this issue.

## Environment variables
[Setting environment variables in KDE][env] is quite simple.
Just add a file in the exactly same location that look like this:
{% highlight bash %}
    ○ → cat ~/.kde/env/path.sh
    export PATH=/opt/bin:$PATH
    export JAVA_HOME=/opt/jdk1.6.0_45
{% endhighlight %}

## East Asian Fonts
All of the ttf-* fonts are replaced with fonts-* in testing distribution.
As of this post, most of the articles out there [are][outdated2]
[outdated][outdated1]. I found most of the right fonts to be installed
in the [Debian fonts subsection page][fonts].

These are the fonts that I install:
{% highlight bash %}
sudo aptitude install fonts-arphic-uming fonts-wqy-zenhei fonts-ipafont-mincho fonts-ipafont-gothic fonts-unfonts-core
{% endhighlight %}

## .bash?rc?profile?
Ok, I have forgotten the role of each of these files again. I was having
a hard time configuring [bash-it][bash-it] for my non-login shell.
[This][superuser] is the best answer I have found so far. I end up sourcing
.bashprofile from .bashrc to make this work.

[prev]: {{page.previous.url}}
[readerchoice]: http://www.linuxjournal.com/rc2013?page=8
[testing]: http://www.debian.org/releases/testing/
[ubuntu-certified-list]: http://www.ubuntu.com/certification/desktop/make/HP/?page=1&category=Laptop
[netselect-apt]: http://askubuntu.com/questions/39922/how-do-you-select-the-fastest-mirror-from-the-command-line
[outdated1]: https://wiki.debian.org/Fonts#Commonly_Used_Fonts
[outdated2]: http://en.wikipedia.org/wiki/Help%3AMultilingual_support_%28East_Asian%29#Debian-based_GNU.2FLinux
[fonts]: http://packages.debian.org/testing/fonts/
[arch-pulseaudio]: https://wiki.archlinux.org/index.php/PulseAudio
[arch-tsched]: https://wiki.archlinux.org/index.php/PulseAudio#Glitches.2C_skips_or_crackling
[arch-jump]: https://wiki.archlinux.org/index.php/PulseAudio#Clients_alter_master_output_volume_.28aka_volume_jumps_to_100.25_after_running_application.29
[env]: http://userbase.kde.org/Session_Environment_Variables
[bash-it]: https://github.com/revans/bash-it
[superuser]: http://superuser.com/a/183980