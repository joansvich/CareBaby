# CareBaby

## Description

The goal of this project is to find the best babysitter in your area related with your preferences.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **Sign up** - As a user I want to sign up on the webpage so that I can contact with the babysitter and as a babysitter I want to sign up on the webpage so that I can offer me as a babysitter
- **Login** - As a user I want to sign up on the webpage so that I can contact with the babysitter and as a babysitter I want to sign up on the webpage so that I can offer me as a babysitter
- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **Babysitter list** - As a user I want to see all the babysitter available so that I can choose which ones I want to hire
- **Babysitter detail** - As a user I want to see the babysitter details and see the reputation so that I can decide if I want to hire

## Backlog

List of other features outside of the MVPs scope

- See babysitters on the map
- Filter preferences
- Popup display on map
- Hire button
- Availability


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - password
    - email
  - validation
    - fields not empty
    - user not exists
  - create user with encrypted password
  - store user in session
  - redirect to /
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
  - validation
    - fields not empty
    - user exists
    - passdword matches
  - store user in session
  - redirect to /
- POST /auth/logout
  - body: (empty)
  - redirect to /

- GET /profile/:id
  - validation
    - id is valid (next to 404)
    - id exists (next to 404)
  - renders the profile page
  - edit button to edit profile
- POST /profile/:id/edit
  - redirects to / if user is anonymous
  - validation
    - id is valid (next to 404)
    - id exists (next to 404)
  - edit name and description
  - save details and redirect to profile

## Models

User model

```
username: String
password: String
email: String
location: String
description: String
```

Babysitter model

```
username: String
password: String
Email: String
location: String
description: String
attendees: [ObjectId<User>]
```

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/joansvich/CareBaby)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)

