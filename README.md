# lecturemon-back

This is the backend for the LectureMon project. It can be a bit tricky to understand, mostly because the database structure isn't ideal, and is subject to future re-writes.

However, barring the confusion the database schemas can cause, the program flow ultimately goes something like this: a series of API endpoints, mostly POST endpoints, take in JSON data from the frontend. They process this frontend-generated data, and usually return some kind of JSON themselves. 

The perfect example of this is account dashboard in the app. It makes two GET requests with the user id in session, one to fetch the list of outstanding surveys, and one to fetch the list of active modules. 

You can use npm install in order to install the required modules and then you can use node server.js in order to start the node server and server requests!
