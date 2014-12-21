---
layout: post
title:  "Automating Signing of Launch4j's exe with Python"
tags: python launch4j
comments: true
---

One of the manual release step that we have is to sign the installers of our products.
This simple step is made complicated by launch4j. The steps that were in place
was from this [discussion here](http://sourceforge.net/p/launch4j/discussion/332683/thread/4e9e2558)
and I'm addressing the most errorneous step of it with a python script in this post:

> Edit test.exe with favorite HEX editor to change last two bytes of exe i.e. the jar i.e.
the zip end of central directory to the size using littleendian byte order and save

You will find my script spitting a lot of information as I was not confident enough
playing with bytes in python. They were helpful to compare the result when we did 
it manually.

This is the function in my script that is modifying the last two bytes of the exe by utilising mmap.

{% highlight python %}
def hack_footer(target, difference_in_bytes):
  with open(target, "r+b") as f:   
    mm = mmap.mmap(f.fileno(), 0)
    mm.seek(mm.size() - 2)
    lastbytes = mm.readline()
    if (lastbytes != b"\x00\x00"):
      sys.exit("File is in an invalid state: Last bytes is not 00")
 
    print("Before: {} (HEX: {})".format(lastbytes, binascii.hexlify(lastbytes)))
 
    mm.seek(mm.size() - 2)
    mm.write(difference_in_bytes)
    mm.seek(mm.size() - 2)
    lastbytes = mm.readline()
    print("After: {} (HEX: {})".format(lastbytes, binascii.hexlify(lastbytes)))
 
    mm.close()
{% endhighlight %}

To calculate the difference_in_bytes was pretty straightforward:

{% highlight python %}
def calculate_difference_in_bytes(original, signed):
  signed_size = os.stat(signed).st_size
  original_size = os.stat(original).st_size
 
  size_difference = signed_size - original_size
  size_difference_bytes = size_difference.to_bytes(2, byteorder='little')
  print("Original size: {}".format(original_size))
  print("Signed size: {}".format(signed_size))
  print("Size difference: {}".format(size_difference))
  print("Size in bytes difference: {}".format(size_difference_bytes))
 
  return size_difference_bytes
{% endhighlight %}
