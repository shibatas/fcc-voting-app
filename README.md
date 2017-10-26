# freeCodeCamp Voting App project
by Shohei Shibata

This is my first-ever attempt at a full-stack web app. All feedbacks are highly welcomed!

## Objectives
Per [FCC website](https://www.freecodecamp.org/challenges/build-a-voting-app):
> Objective: Build a full stack JavaScript app that is functionally similar to this: https://fcc-voting-arthow4n.herokuapp.com/ and deploy it to Heroku.

> Here are the specific user stories you should implement for this project:
>
> * User Story: As an authenticated user, I can keep my polls and come back later to access them.
> * User Story: As an authenticated user, I can share my polls with my friends.
> * User Story: As an authenticated user, I can see the aggregate results of my polls.
> * User Story: As an authenticated user, I can delete polls that I decide I don't want anymore.
> * User Story: As an authenticated user, I can create a poll with any number of possible items.
> * User Story: As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
> * User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)
> * User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.


This app incorporates the following:
- [Clementine.js FCC Boilerplate](https://github.com/johnstonbl01/clementinejs-fcc)
- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- [MongoDB](http://www.mongodb.org/) for database
- [Passport](https://github.com/passport/www.passportjs.org) (GitHub Strategy)
- [React](https://reactjs.org/) for rendering the pages
- [D3](https://d3js.org/) for rendering the pie chart

### To Do
The app checks all the boxes in terms of function, but I would like to improve the following either in this app or in my next project:
- Use JSX for React code. As first time I wanted to code without JSX. Next time I will use JSX for cleaner code!
- React *createClass* and *PropTyes* are both deprecated. Tutorials I followed were using outdated code. I will learn the appropriate latest methods next time.
- React elements do not have proper kep props assigned. Need to fix this.
- Perhaps add facebook and/or twitter strategies to authentication in case my non-coding friends and family want to vote.

## License

MIT License. [Click here for more information.](LICENSE.md)
