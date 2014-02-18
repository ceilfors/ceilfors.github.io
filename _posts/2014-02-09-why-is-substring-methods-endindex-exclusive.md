---
layout: post
title:  "Why is substring method's end index exclusive?"
tags: programming string
comments: true
---

Imagine you have a string `s = "01234"`. You want to extract the substring of "123" from it.
The example of the string that I use here is simple as each of the characters represents its index.
That means to get the substring "123", the start index is 1, and the end index is 3, right? Unfortunately,
this is wrong in most of programming languages out there. Let me exemplify:

| Language      | Code               | Output  
| ------------- | ------------------ | :----:
| python        | s[1:3]             | 12    
| java          | s.substring(1, 3); | 12 
| javascript    | s.slice(1, 3)      | 12 

Observe that we are getting "12" instead of "123". The right end index is in fact 4.
Why is this strange behavior? This is because 
> the substring method's end index is exclusive

Without rationalization, our little brain just forgets this behavior.
I will rationalize this behavior thus remembering it will be easier.

## Made for real use cases
There are two conventions being discussed to extract the substring of "123" (I will use only python
for shorter code starting from here). The two conventions are:

1. s[1:4] # The working convention
2. s[1:3] # What we think is intuitive

Clearly there are good reasons why the language creators preferred _Convention 1)_. 

As a proposition, I will borrow some of the [argument from Djikstra][djikstra0]'s essay
regarding *Why numbering should start at 0*, since they are reciprocal.

> the difference between the bounds as mentioned equals the length of the subsequence

How is this related to our problem? Observe the following in _Convention 1)_:

- the difference between the start index and the end index is **3**. (4 - 1)
- the length of the substring is **3**. ("123")

Yes, *the difference between the start index and end index equals to the length
of the substring*.

```python
endIndex - startIndex == len(substring)
```

To understand the value of this formula better, let's see how our code look like
with both of the conventions, given the use cases below.

| Use case                           | Convention 1)        | Convention 2)
| ---------------------------------- | -------------------- | ------------------
| a) First x chars                   | s[0:0 + x]           | s[0:0 + x - 1]
| b) Last x chars                    | s[len(s) - x:len(s)] | s[len(s) - x:len(s) - 1]
| c) Index x with length of y        | s[x:x + y]           | s[x:x + y - 1]
| d) Index x to index of separator y | s[x:s.index(y)]      | s[x:s.index(y) - 1]
| e) Index x to index y              | s[x:y + 1]           | s[x:y]

Observe that in the first four use cases, _Convention 2)_ looks ugly. These common use
cases can be coded prettily with _Convention 1)_. Hence _Convention 1)_, which has an
exclusive end index, had been seen as a more *intuitive* way for slicing a string.
It is prettier to solve a more common use cases.

Now, if you have noticed, the last use case looks pretty with _Convention 2)_.
_Use case e)_ is usually a problem that has been solved with human eyes and to be coded
into a program. This is actually the problem that has been given at the very beginning
of this post. We *already know* that we want to extract "123" before even we code them.
**The caret index method** will help you find the end index for this particular use case.

## The caret index method
Finding the end index for a predetermined character is easy with the caret index method.
This method requires a simple tweak of the definition _index_. The index should be seen as
a _caret index_.

- _Caret index_ refers to the index of the caret position; **not** the index of the
character in the string.
- _[Caret][caret]_ [itself][caretwiki] refers to the flashing vertical line in a text editor
which indicates where a character will be placed when entered.

Therefore:

```python
|01234 # caret index 0
0|1234 # caret index 1
0123|4 # caret index 4
01234| # caret index 5
```

Going back to the initial problem, "123" will be extracted out like so:

```python
0|123|4 # caret start index 1, caret end index 4
```

## Bonus: Groovy gotcha
Be careful when you are using Groovy. If you slice the string the Groovy way, you will get "123":

```groovy
s[1..3]
```

I'm not going to say that Groovy is *not* adhering _Convention 1)_. It is more like
a gotcha. The `1..3` represents a *range*, it is more intuitive if it includes 3 as you read it:
*1 until 3*. Do the following to make the end index exclusive:

```groovy
s[1..<3]
```

[djikstra0]: http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html
[caretwiki]: http://en.wikipedia.org/wiki/Cursor_(computers)#Text_cursor
[caret]: http://www.merriam-webster.com/dictionary/caret