# Snake

Working with events in a Snake game for The Odin Project's [Project: jQuery and the DOM](http://www.theodinproject.com/javascript-and-jquery/jquery-and-the-dom).  Key events are detected and processed to control the Snake's movement.

## Gameboard

The gameboard is a simple 40 by 40 grid on which the snake moves.  Above the gameboard (to the left) the current game Level and game Score are displayed; (to the right) a simple message tells you how to start or pause/unpause the game.

## Gameplay

### Controls

Press any key to begin the game (the snake begins moving to the right).

You can pause and unpause the game at anytime by pressing the `p` key.

Control the snake with the direction keys.  All direction key presses are stored and processed, so you may press multiple keys on each "game frame" (which can be very helpful when the game speeds up).

### Objective

Eat the red food on the game board to increase your score and the snake's length.  After eating 5 food items, you progress to the next level.  The new level gives you more points for each food eaten, but also speeds up the Snake game.

### Endgame

The game ends when you go off the gameboard or go over the body of the snake.

---

[Play Snake here](http://htmlpreview.github.io/?https://github.com/donaldali/odin-js-jquery/blob/master/snake/index.html "Snake").
