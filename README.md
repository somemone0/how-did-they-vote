# How Did They Vote
### Summary
**A demo is available [here](https://somemone0.github.io/how-did-they-vote)**

This project creates a live voting area app that tracks the user's location, and where that area voted. Built primarily from a React application,
the app uses a Census API to get the census block at the user's coordinates, then uses a Flask API I built to match that census block to voter data.
With this information, the user is presented with the block's lean in the 2020 US election, and the block's swing from the 2016 election. By
selecting the buttons on the top of the screen, the user can select the elections tracked by the DRA dataset (they change by state). Swings are available for non-presidential elections as well, but they only track swings between types of elections, not individual candidates. (The swing from the 2016 to 2018 Senate elections in Wisconsin tracks two different races, Baldwin-Vukmir and Johnson-Feingold)
### Reflection

My favorite part about this project was the tangibility of its' results. After building its' first iteration, me and a friend drove around our town, just reading off the results it gave us. The project represented real data that existed, and 

---
### APIs/Technologies Used
 - React (for the Frontend)
 - Flask (for the Voting Data API)
 - JavaScript
 - Python

### Datasets Used
 - [VTD_data](https://github.com/dra2020/vtd_data), which matches block groups to voting results, made by Dave's Redistricting
