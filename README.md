# TweedStudy in React

## Out Tech Stack
 - Front-end: React
 - Back-end: Express and MongoDB

## Installation
1. "git clone https://github.com/dphuang2/tweedstudy-react.git"
2. Install MongoDB https://docs.mongodb.com/manual/installation/
2. npm install (this install all the node modules for react)
3. npm install -g nodemon (so you can run nodemon from command line) - this is
   used for watching changed files and restarting the server when files change

## Usage
- To start the front-end react server: "npm start"
- To start MongoDB database: "npm run db" <-- You must start your database
  before you start your server...duh
- To start the back-end express server: "npm run server"

## TODO

### General notes
please checkout a new branch with "git checkout -b <branch name>" so that you
are not messing with anyone else's code when you push to GitHub. After you each
complete your tasks, each team will make pull requests with all their code onto
the master branch and we can deal with conflicts then.

### Team #3 notes (Interface with Twitter's API)
Look inside server.js and implement Twitter API requests under "TODO". Use "npm
run server" to test your code. You don't need to install MongoDB yet or save
anything to the database but it is worth your time to understand how a REST API
works as well as looking inside the api/ folder to see how a basic Todo app
could be setup. You have to go to Twitter's dev website and create an
application to receieve API keys to make your API calls. You should probably use
a JavaScript library for making the calls (or you can form your own requests and
do that as well, both methods are good).

### Team #2 notes (Recreating slider that can filter Twitter data [stored in a
variable])
Use "npm start" to test your code. The folder that you need to focus on is src/.
Remember it is good practice to create new folders for each component you make.

### Team #1 notes (Recreating Twitter feed)
Use "npm start" to test your code. The folder that you need to focus on is src/.
Remember it is good practice to create new folders for each component you make.
