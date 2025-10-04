# Farm Game for Web Technologies HW3

## How to Run the Game
- Open index.html in your choice of browser like Firefox or Chrome and press **Start**.
- Use the arrow keys on your computer to move the farmer around the field to collect the crops. 
- The goal is collect crops before the timer is up, while also trying to avoid obstacles like scarecrows.
- The game ends when you reach the crop goal or when there is no time left. 


## New Features
- **Different types of crops:** I added new crops like wheat, pumpkins, and golden apples which appear randomly on the field. Each of these crops has its own unique color and point value. Wheat has a score of 1 point, pumpkins have a score of 3 points, and golden apples have a score of 5 points. Adding these features adds a layer of strategy and visually interesting. 

- **Difficulty curve:** I also added a difficuty curve to this game. Over time, crops spawn at a faster rate. I adjusted the spawn rate according to how much time is left, causing the game to become more intense the longer you play. 


## Where I Used Arrow Functions, This, and Bind
- **Arrow Functions:** I used arrow functions in Game.js for the tick() method and the UI button callbacks. This helped maintain the correct 'this' context so that the game loop and event handlers worked properly. I also used them because they do not create their own 'this', which helped make my code cleaner and easier to understand. 

- **This:** I consistently used 'this' in my classes like Farmer, Game, and Crop to refer to the current object. I made sure it was scoped correctly, particularly within callbacks and event handlers. Understanding how 'this' works in various situations helped me avoid bugs and made my logic more reliable. 

- **Bind:** In my Input class, I used '.bind(this)' when setting up key event listeners. Without 'bind', the 'this' keyword within those methods would have referred to the window instead of my class instance. Utilizing bind gave me more control over the behavior of my methods when they were triggered by events. 

