Beginning of a non-linear video player for HTML5 video element
==============================================================
Jonathan Kaye
@JonKaye
May, 2014

This is a quick project I put together to learn and test out using the HTML5 video element.

As you will see from the code examples, I wanted to make an HTML5 video player in which I could jump to various parts of a video, simulating walking around a fire scene. I don't have all the bells and whistles (actually, few bells or whistles are there), but I got most of what I wanted to accomplish in here. I have tested the code on Windows, Mac, Android, and the iPad -- on the iPhone or iPod touch, it seems that the video element goes full-screen immediately, and hence the overlays don't work. On the mobile platforms that do work (Android and iPad), you have to press the Play button to start the video.

Basically, I made a movie that walks through all the locations, then I recorded the times in each segment that I wanted to navigate. In my movie, I show a cluster of navigation arrows, and therefore I made HTML transparent overlays in the positions of those arrows, that lets the user click to 'move' in that direction, i.e., skip to the relevant section of the video.

I originally started with just an mp4 movie, but then I also made a fallback to ogv and webm -- I think that solved a problem I was having on Android or iOS, but I can't say for certain. The main problem I was having on mobile platforms was that the movie metadata, particularly how much of the video had loaded already, was coming back funky. I think the multiple movie versions solved this.
 
I tried to break up the code into a player part (susplayer.js), which should work in general, and a specific part for the specific movie (I placed in simparams.js).