# fakebook-client
Front end client for fakebook (Social Media Site)

## Introduction 
This is the client used for the MERN stack site [fakebook](https://fakebook-danieltran.netlify.app/#/login). As the stack implies React is used for the front end. For more information about the back end, check out this repository [fakebook-api](https://github.com/DanielTran0/fakebook-api).

## Features

From the site name it is obvious what this site is trying to mimic. With that being said, as many Facebook features as possible were incorporated and this will briefly go over a few of them.

### Posts
* Posts can be created anywhere with the navigation bar.
* Posts only show the most recent comment unless clicked to show them all.
* Hover effects on the number of likes to see which users liked the post (click for mobile).
* User comments and adding comments can be toggled on the post itself or set permanently to the styled wished for in the settings.

Example:  
![image](https://user-images.githubusercontent.com/76408883/123696216-7dc12200-d829-11eb-9612-ba5024556e77.png)


### User page
* Can add or change profile and background images (only if owner).
* Can view, edit (only if owner), comment on all posts belonging to that specific user.
* Can view their friends and add them if wanted.

### Timeline
* Shows the 10 most recent posts from the user and all their friends.
* When scrolling to the bottom of the page 10 more posts will be fetched.

### General
* Supports dark mode.
* Mobile friendly.

## HTTP Requests

Uses [axios](https://github.com/axios/axios) to make all HTTP requests to the API back end and sets Authorization Headers when receiving a JWT token.

## Real Time

Uses [Socket.IO-client](https://socket.io/) to send chatroom user data to the server and receive all available chatroom users and their messages for React to render.

## UI

Uses [Material-UI](https://material-ui.com/), its icons and custom CSS to style the site and make it responsive.

