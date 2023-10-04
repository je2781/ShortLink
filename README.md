# Getting started with Shortlink

I started with creating endpoints for encoding, decoding, and later finishing up the gather stats endpoint. 
To manage authentication I used a stateful data representation system (sessions/cookies), rather than tokens. 
It's preferable, when using making a small app that doesn't require users' activity and data being recorded infinitely.