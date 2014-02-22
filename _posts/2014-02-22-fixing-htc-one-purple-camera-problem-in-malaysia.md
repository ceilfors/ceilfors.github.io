---
layout: post
title:  "Fixing HTC One Purple Camera Problem in Malaysia"
tags: android htc-one malaysia
comments: true
---

*tl;dr: I've got my phone fix by replacing the camera module by HTC in 14 working days.*

**This post shares my experience on fixing this issue, and hopefully
yours too. I will cover the tips before sending it over to HTC, what to expect from them,
and what to be done after you got it back.**

Are you having purple tints in your pictures? Your friends think that you are
using purple instagram filter? You have a purple camera problem.
As annoying as it is, this only happens in a few batches of HTC One.

## Not a software issue
There are two speculations to fix this purple camera problem; software and hardware.
I'm going to tell you upfront and save your time. 
I'd got mine fixed by replacing the **camera module**.

A few articles out there might have convince you that the purple camera problem is a
software issue, and the fix is coming soon. Since we are in Malaysia, the update is even **slower**.
So, **don't wait for the update nor waste your time flashing**. Send it over before your warranty ends!
I had tried to flash my phone to Android version 4.4.2 with the Stock, [Google Play Edition][gpe] and
[Android Revolution HD][android-revolution-hd] with no success.

## Preparation and contacting HTC
Replacing HTC One's camera module requires you to send your phone to HTC
and get it serviced. HTC is providing a free pick up service by UPS, use it!

Before you send your phone for servicing, ensure you are well prepared:

- Backup your data.

  All of your data will be gone.
  If you are rooted, you can use [Titanium Backup][titanium-backup].

- HTC is not providing a loan phone. Get one from your friends.

- Photostat your phone's receipt for your phone warranty (proof of purchase).
  Hand this over upon pick up by UPS.

- Check and keep your camera sensor name.

  This is useful to check if your camera module has been 
  replaced later. The camera sensor name is stored in `/sys/android_camera/sensor`. You can use ES File Explorer to check this. You can also use adb shell, then `cat /sys/android_camera/sensor`.

  I will explain more on the usage of this in the last section.

- If you are S-OFF, you need to S-ON, relock, and remove the tampered flag.

  *If you don't understand any of the terms at this point, I will assume that you have not been
  tinkering your phone, you are safe to move on.*
  Though  some of you might say that it is [okay to leave it unlocked][warranty-void],
  I did not want to risk this.

After you are done with the above preparation, you are ready to request for phone for pick up.

Due to personal reason I would recommend contacting [HTC via email][htc-email]. I felt that
they are more responsive from email (this is actually my second attempt; won't go into
details in this post). Hence, send the request now and keep it short, the key points are:

- You have purple camera problem.
- You need the camera module replaced.
- You need a pick up service and the UPS tracking number.

## Waiting duration and HTC efficiency
These are the raw statistics from my experience. I'm not going to judge whether
they are fast or slow. You be the judge whether or not it is worth waiting for.
After reading some of comments in HTC Malaysia's facebook, your waiting duration should
also be vary.

Total holidays: 1  
Total working days at UPS: 5  
*Total working days at HTC*: 14  
Total working days waiting for email reply: 1 (first day)  
**Total working days waiting**: 20  

### Chronology
2014-01-20 [Email sent][htc-email] for phone pick up request.  
2014-01-21 Email received with UPS tracking number.  
2014-01-22 UPS picked up my phone.  
2014-01-23 UPS delivered my phone to HTC.  
2014-01-24 Call received from HTC for purple tint camera issue confirmation.  
2014-02-11 Email sent for phone status request.  
2014-02-12 Email received. Issue is fixed and will be couriered soon.  
2014-02-14 Email sent for delivery date estimation request.  
2014-02-14 UPS picked up my phone from HTC. (Knew this from the tracking number below)
2014-02-17 Email received with UPS tracking number.  
2014-02-17 UPS delivered my phone to me.  

## Diagnose your phone after you got it back

{% picture portrait {{page.id}}/box.jpg class="right" %}
So you've got your phone back. It comes back with a nice return packaging.
You are happy. Stop right there! During my research,
some of the unfortunate guys out there had sent their phone to HTC to fix the purple
camera problem more than once. Let's confirm that you are not one of them.

**First**, check if the camera problem is really fixed. Turn the camera on and put in on
a table. Leave it for about 1 hour. Keep activating the camera by tapping it 
when it falls asleep. You are expecting to see a **constant black screen** without
a single **purple dot**!

**Next**, remember that we have kept our camera sensor name? Check
it again to see that it has changed in `/sys/android_camera/sensor`.
These were my camera sensor names:

- **old**: st vd6869(1.0) cinesensor 2013-05-03
- **new**: ov ov4688 4M

Why is this important? It is important to check the camera sensor name because if they replace it
with the old camera module model again, the purple camera problem might come again.
Try to remember, you didn't actually have this problem when the first time you
bought and use your HTC One. We get this issue **only** after a few months of usage.

That's it. Enjoy your new UltraPixel camera!

[gpe]: http://forum.xda-developers.com/showthread.php?t=2358781
[android-revolution-hd]: http://android-revolution-hd.blogspot.com/
[htc-email]: http://www.htc.com/sea/contact/email/
[titanium-backup]: https://play.google.com/store/apps/details?id=com.keramidas.TitaniumBackup
[warranty-void]: http://android-revolution-hd.blogspot.com/2013/03/unlocking-bootloader-or-flashing-custom.html
