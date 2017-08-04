# General Comments

Over these three reviews there are a lot of syntax useages I am not familiar with. It's possible this is highlighting the fact that when I started at the guild we jumped straight in to projects that almost always had a UI and were structured like full-stack apps but my gut tells me a lot of conventional design patterns are not being followed and I would suggest you follow up with an SEP.

Examples of this:
In the `app.js` file of this repo there is a lot of HTML instead of such work being in x.html files, in a views folder, that are required in x.js files that opperate on the html.

You create a messages.js file to handle sending the user, shell etc.. a message and often times these messages are only used in one instance and this methodology seems like overkill to me and abstracts away what your code is doing making it hard for me to follow.

In your schema.sql files it seems you are making a function declaration when these files should only ever define a schema. I would recommend a querries.js file to store your SQL query stings set to a const variable and then use those variables in JS functions. Then your client, middleware, and server side scripts can call those as needed.

In all your logic, and delivery is solid, and demonstrates you are thoroughly able to achieve the desired results, and I really appreciate your documentation. I can't emphasize enough how important that is and you are rocking it.

All of the projects I reviewed for you work great, meet the specs, and are well documented. The only main suggestion I have is practicing better design patterns and refactoring your process for readability and brevity. Please ask me any questions and if you want to go through examples of some of these principles and patterns in larger-scale applications to understsnd what I am getting at please let me know and we can find some time to sit down and go through some stuff. Also, I always suggest second opinions from SEPs, whenever they are available and if any of them tell you what I've said is completely wrong, please relay that to me as well.  
