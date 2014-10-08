// Snake game
$( document ).ready(function() {
  var snakeGame = (function() {
    // Constants
    var ROWS = 40,
        COLS = 40,
        BLANK = " ",
        HEAD = "H",
        BODY = "B",
        FOOD = "F",
        LEFT = { change: [0, -1], key: 37 },
        UP = { change: [-1, 0], key: 38 },
        RIGHT = { change: [0, 1], key: 39 },
        DOWN = { change: [1, 0], key: 40 },
        PAUSE_KEY = 80,
        NOT_FEEDING = 1,
        FEEDING = 2,
        JUST_FED = 3,
        MAX_LEVEL_FOOD = 5;

    // Variables
    var score = 0,
        level = 1,
        level_food_left = MAX_LEVEL_FOOD,
        paused = true,
        snake = {
          head: { 
            position: [20, 20],
            direction: RIGHT
          },
          body: [ [20, 19] ]
        },
        speed = 200,
        nextDirection = [],
        feedState = NOT_FEEDING,
        foodPosition,
        timerID;

    // Create the Markup for the snake game
    var initializeBoard = function() {
      var $board = $( '.board' ).empty(),
          $row,
          $square;

      for ( var i = 0; i < ROWS; i++ ) {
        $row = $( '<div class="row"></div>' );
        for ( var j = 0; j < COLS; j++ ) {
          $square = $( '<div class="gamesquare blank"></div>' );
          $square.attr( 'data-position', positionNumber( [i, j] ) );
          $row.append($square);
        }
        $board.append($row);
      }

      setSquare( snake.head.position, HEAD );
      setSquare( snake.body[0], BODY );
    };

    // Configure a board square to display appropriately
    var setSquare = function( position, type ) {
      renderSquare( position, type );
    };

    // Find the Markup representing a square and configure it
    var renderSquare = function( position, type ) {
      var pos = positionNumber( position );
      var $square = $('div').find('[data-position="' + pos + '"]');
      setSquareType($square, type );
    };

    // Remove styling classes from a square
    var clearSquare = function( $square ) {
      $square.removeClass( 'snakebody' ).removeClass( 'snakehead' ).
              removeClass( 'food' ).removeClass( 'blank' );
    };

    // Apply appropriate class to style a board square
    var setSquareType = function( $square, type ) {
      clearSquare( $square );
      switch (type) {
      case HEAD:
        $square.addClass( 'snakehead' );
        break;
      case BODY:
        $square.addClass( 'snakebody' );
        break;
      case FOOD:
        $square.addClass( 'food' );
        break;
      case BLANK:
        $square.addClass( 'blank' );
        break;
      default:
        console.log('Unknown Board Type');
      }
    };

    // Randomly place food on a blank board square
    var generateFood = function() {
      var snakePositions = snake.body.concat( [snake.head.position] );
      var row, col;
      do {
        row = Math.floor( Math.random() * ROWS );
        col = Math.floor( Math.random() * COLS );
      } while ( hasPosition( snakePositions, [row, col] ) );
      foodPosition = [row, col];
      setSquare( foodPosition, FOOD );
    };

    // Check if an array of positions contains a provided position
    var hasPosition = function( positions, position ) {
      var foundPosition = false;
      $.each( positions, function( index, pos ) {
        if ( equalPositions( pos, position ) ) {
          foundPosition = true;
          return false;
        }
      });
      return foundPosition;
    };

    // Check if two positions are the same
    var equalPositions = function( position1, position2 ) {
      return positionNumber( position1 ) === positionNumber( position2 );
    };

    // Convert an array representation of a position into a number
    var positionNumber = function( position ) {
      return ( position[0] * ROWS ) + position[1];
    };

    // Place a captured directional key in a queue to be used later
    var storeDirection = function( event ) {
      var keyPressed = event.which;

      if ( keyPressed === PAUSE_KEY ) {
        handlePause();
      } else if ( !paused ) {
        switch ( keyPressed ) {
        case LEFT.key:
          event.preventDefault();
          nextDirection.push( LEFT );
          break;
        case UP.key:
          event.preventDefault();
          nextDirection.push( UP );
          break;
        case RIGHT.key:
          event.preventDefault();
          nextDirection.push( RIGHT );
          break;
        case DOWN.key:
          event.preventDefault();
          nextDirection.push( DOWN );
          break;
        }
      }
    };

    // Check if an end game condition is met
    var gameOver = function() {
      return isOutOfBounds() || hasBitenSelf();
    };

    // Check if the snake's head is off the gameboard
    var isOutOfBounds = function() {
      var headRow = snake.head.position[0],
          headCol = snake.head.position[1];
      return ( headRow < 0 || headRow >= ROWS || 
               headCol < 0 || headCol >= COLS ) ? true : false;
    };

    // Check if the snake's head is on the snake's body
    var hasBitenSelf = function() {
      return hasPosition( snake.body, snake.head.position );
    };

    // Update the head's direction with the first orthogonal direction
    // in the queue of captured directions (if one exists)
    var updateHeadDirection = function() {
      var curDir = snake.head.direction,
          posDir;
      while ( nextDirection.length ) {
        posDir = nextDirection.shift();
        // Ignore a next direction the same as current direction
        if ( curDir.key === posDir.key ) {
          continue;
        } else if (
          // Ignore a next direction opposite to current direction
          ( curDir.key === LEFT.key && posDir.key === RIGHT.key ) ||
          ( curDir.key === UP.key && posDir.key === DOWN.key ) ||
          ( curDir.key === RIGHT.key && posDir.key === LEFT.key ) ||
          ( curDir.key === DOWN.key && posDir.key === UP.key ) ) {
          continue;
        } else {
          snake.head.direction = posDir;
          break;
        }
      }
    };

    // Move the head, after updating it's positions
    var moveHead = function() {
      snake.head.position[0] += snake.head.direction.change[0];
      snake.head.position[1] += snake.head.direction.change[1];
      setSquare( snake.head.position, HEAD );
    };

    // Guide the snake through the feeding process over multiple moves
    var feed = function() {
      if ( feedState === NOT_FEEDING && 
           equalPositions( snake.head.position, foodPosition ) ) {
        feedState = FEEDING;
      } else if ( feedState === FEEDING ) {
        handleFeeding();
      } else if (feedState === JUST_FED ) {
        generateFood();
        feedState = NOT_FEEDING;
      }
    };

    // Update score and, when appropriate, level of the game.
    // Updating level involves speeding up the game
    var handleFeeding = function() {
      var speedIncreaseFactor = 1.25;
      score += level;
      $( '.score ' ).find( 'span' ).html( score );

      level_food_left--;
      if ( !level_food_left ) {
        level++;
        level_food_left = MAX_LEVEL_FOOD;
        speed = Math.ceil( speed / speedIncreaseFactor );
        $( '.level ' ).find( 'span' ).html( level );
      }

      feedState = JUST_FED;
    };

    // Move the snake one step
    var move = function() {
      if ( feedState !== FEEDING ) {
        var clearPosition = snake.body.pop();
        setSquare( clearPosition, BLANK );
      }
      var bodyPosition = snake.head.position.slice();
      snake.body.unshift( bodyPosition );
      setSquare( bodyPosition, BODY );

      updateHeadDirection();
      moveHead();
      feed();
    };

    // Set message above the gameboard
    var displayMessage = function( message ) {
      $( '.message' ).html( message );
    };

    // Pause or unpause the game and display an appropriate message
    var handlePause = function() {
      if ( paused ) {
        paused = false;
        displayMessage("Press P to pause");
        runGame();
      } else {
        paused = true;
        displayMessage("Game Paused...Press P to resume");
        clearTimeout( timerID );
      }
    };

    // Setup the timer to run make game moves at a given interval
    var runGame = function() {
      timerID = setTimeout( function() { 
        if ( gameOver() ) {
          playAgain();
          return;
        }
        move();
        runGame(); }, speed );
    };

    // Display endgame message then restart game
    var playAgain = function() {
      displayMessage( 'GAME OVER...' );
      var $prompt = $( '<div class="gameover">' +
                          '<p>Game Over :-(</p>' +
                          '<button>Play Again</button>' +
                        '</div>' );
      $( '.board' ).append( $prompt );
      $( '.gameover' ).find( 'button' ).on( 'click', function() {
        location.reload();
      });
    };

    // Wait for a key event to start the game
    $( 'body' ).one( 'keydown', function() {
      paused = false;
      displayMessage("Press P to pause");
      runGame();

      // capture key events
      $( 'body' ).on( 'keydown', function( event ) {
        storeDirection( event );
      });
    });

    // Initialize board; then wait for keyboard events
    var play = function() {
      initializeBoard();
      generateFood();
    };

    return { play: play };
  })();

  snakeGame.play();
});
