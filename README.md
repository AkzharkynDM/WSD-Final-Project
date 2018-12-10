# WSD-Final-Project
The final project "Online game store for JavaScript games" for Web Software Development course

# Members:
Akzharkyn Duisembiyeva 727406
Ahmed Aly Bedair
Shamim Biswas

# Application overview:
Online game store for JavaScript games
Features of application:
Register as a player and developer
As a developer: add games to their inventory, see list of game sales
As a player: buy games, play games, see game high scores and record their score to it

# Models and views:
Game
date_updated = models.DateTimeField(auto_now=True)
players = ArrayField(ArrayField(CharField(max_length=64)))

Developer
name = models.CharField(max_length=64)
earned_money = models.CharField(max_length=64)

Player
name = models.CharField(max_length=64)
credit_card_info = models.CharField(max_length=64)

# Working methods:
Regular face-to-face meetings, Skype conferences. 

# Implementation steps:
frontend - initial design with HTML pages will be implemented. After the completion of logic and functionality of app, the improvement on frontend will be done.
backend - this will focus on logic of the full application and will be changed and improved throughout the completion of project.
security - the authentication, storing the user’s bank credentials, the asset for developers will be enabled. Further, the penetration tests will be performed to test the viability, stability and functionality of our application.

# Timetable:
The project needs to be completed by the end of 3rd term. The general milestones are determined as follows:
19.1 - End of backend functionality, proper testing of backend, logic of game
10.2 - Improving the frontend of application, resolving security issues
19.2 - Testing of full application and deploying in Heroku




