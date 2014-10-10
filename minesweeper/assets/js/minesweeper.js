// Minesweeper
var minesweeper = (function() {
  
  var SQUARE_STATE = {
    blank: 1,
    opened: 2,
    flagged: 3,
    question: 4
  },
  IMAGE = {
    blank: 'assets/images/board/blank.gif',
    flagged: 'assets/images/board/flagged.gif',
    question: 'assets/images/board/question.gif',
    minedeath: 'assets/images/mine/minedeath.gif',
    minemisflagged: 'assets/images/mine/minemisflagged.gif',
    minerevealed: 'assets/images/mine/minerevealed.gif',
    facedead: 'assets/images/face/facedead.gif',
    facesmile: 'assets/images/face/facesmile.gif',
    facewin: 'assets/images/face/facewin.gif',
    'number-': 'assets/images/number/number-.gif',
    number0: 'assets/images/number/number0.gif',
    number1: 'assets/images/number/number1.gif',
    number2: 'assets/images/number/number2.gif',
    number3: 'assets/images/number/number3.gif',
    number4: 'assets/images/number/number4.gif',
    number5: 'assets/images/number/number5.gif',
    number6: 'assets/images/number/number6.gif',
    number7: 'assets/images/number/number7.gif',
    number8: 'assets/images/number/number8.gif',
    number9: 'assets/images/number/number9.gif',
    open0: 'assets/images/open/open0.gif',
    open1: 'assets/images/open/open1.gif',
    open2: 'assets/images/open/open2.gif',
    open3: 'assets/images/open/open3.gif',
    open4: 'assets/images/open/open4.gif',
    open5: 'assets/images/open/open5.gif',
    open6: 'assets/images/open/open6.gif',
    open7: 'assets/images/open/open7.gif',
    open8: 'assets/images/open/open8.gif'
  },
  options = {
    width: 9,
    height: 9,
    mines: 10
  };

  // Check if a [row, col] position is valid
  var isValidPosition = function( position ) {
    return position[0] >= 0 && position[0] < options.height &&
           position[1] >= 0 && position[1] < options.width;
  };

  // Convert a [row, col] position to a single number
  var linearPosition = function( position ) {
    return position[0] * options.width + position[1];
  };

  // Bound a given number between a min and max
  var restrict = function( num, min, max ) {
    if( !num ) {
      num = 0;
    }
    if( num < min ) {
      return min;
    } else if( num > max ) {
      return max;
    } else {
      return num;
    }
  };

  // Main Minesweeper board object containing various properties and
  // methods to play Minesweeper.
  var board = {
    // Initialize properties for a new Minesweeper game
    initialize: function() {
      this.rows = options.height;
      this.cols = options.width;
      this.minesLeft = options.mines;
      this.timePassed = 0;
      this.timerID = 0;
      this.squares = [];
      this.minePositions = [];
      this.squaresOpened = 0;
      this.noneOpened = true;
      this.create();
    },

    // Create markup necessary for a Minesweeper game
    create: function() {
      var content;
      for( var i = 0; i < this.rows; i++ ){
        content += '<tr>';
        for( var j = 0; j < this.cols; j++ ) {
          this.squares.push( new Square( [i, j] ) );
          content += '<td><img src="' + IMAGE.blank +
                     '" id=' + ( i * this.cols + j) + '></td>';
        }
        content += '</tr>';
      }
      $( '.container' ).width( this.cols * 16 + 20 );
      $( 'tbody' ).empty().append( content );

      this.displayMinesCount();
      this.displayTimer();
    },

    // Generate Mines after the player opens the first board square,
    // ensuring that the first cleared square will not be a mine
    generateMines: function( position ) {
      var size = options.width * options.height,
          // Randomize array element order in-place.
          // Using Fisher-Yates shuffle algorithm.
          shuffleArray = function( array ) {
            for (var i = array.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var temp = array[i];
              array[i] = array[j];
              array[j] = temp;
            }
            return array;
          };

      for( var i = 0; i < size; i++ ) {
        // Exclude the position passed in (which was the first position
        // clicked by the player) from  the possible mine positions.
        if( i !== position ) {
          this.minePositions.push( i );
        }
      }
      this.minePositions = shuffleArray( this.minePositions ).
                           slice( 0, options.mines );
      this.addMines();
    },

    // Put mines in generated positions, and update the squares around each
    // mine to know how many mines is adjacent to each square
    addMines: function() {
      var square,
          neighborSquare,
          neighborPositions,
          squares = this.squares;

      $.each( this.minePositions, function( index, position ) {
        square = squares[ position ];
        square.isMine = true;
        // Update neighbors
        neighborPositions = square.neighborPositions();
        $.each( neighborPositions, function( index, neighborPosition ) {
          neighborSquare = squares[ neighborPosition ];
          neighborSquare.adjacentMines += 1;
        });
      });

      this.timerID = setInterval( this.updateTimer.bind( this ), 1000 );
    },

    // Show how many more mines can be flagged
    displayMinesCount: function() {
      var display = restrict( this.minesLeft, -99, 999 ),
          // Format the mine count to be displayed
          displayStr = ('00' + Math.abs(display) ).slice(-3);
      if ( display < 0 ) {
        displayStr =  '-' + displayStr.slice( -2 );
      }
      $( '#mine0' ).attr( 'src', IMAGE['number' + displayStr[0]] );
      $( '#mine1' ).attr( 'src', IMAGE['number' + displayStr[1]] );
      $( '#mine2' ).attr( 'src', IMAGE['number' + displayStr[2]] );
    },

    // Increase time every second
    updateTimer: function() {
      this.timePassed++;
      this.displayTimer();

      if ( this.timePassed >= 999 ) {
        this.timePassed = 999;
        clearInterval( this.timerID );
      }
    },

    // Show how long the game has been played
    displayTimer: function() {
      // Zero pad the time to be displayed
      var displayStr = ('00' + Math.abs(this.timePassed) ).slice(-3);
      $( '#time0' ).attr( 'src', IMAGE['number' + displayStr[0]] );
      $( '#time1' ).attr( 'src', IMAGE['number' + displayStr[1]] );
      $( '#time2' ).attr( 'src', IMAGE['number' + displayStr[2]] );
    },

    // Main method to control how a user's click (left or right) is handled
    handlePlay: function( clickType, $square ) {
      var square = this.squares[ $square.attr( 'id' ) ];
      if ( clickType === 1 ){ // Left click
        switch( square.state ) {
          case SQUARE_STATE.blank: // fall through
          case SQUARE_STATE.question:
            this.handleOpen( square, $square );          
            break;
          case SQUARE_STATE.flagged: // fall through
          case SQUARE_STATE.opened:
            break;
        }
      } else if ( clickType === 3 ) { // Right click
        switch( square.state ) {
          case SQUARE_STATE.blank:
            this.updateSquare( square, SQUARE_STATE.flagged, 
                              $square, IMAGE.flagged );
            this.minesLeft--;
            this.displayMinesCount();
            break;
          case SQUARE_STATE.question:
            this.updateSquare( square, SQUARE_STATE.blank, 
                              $square, IMAGE.blank );
            break;
          case SQUARE_STATE.flagged:
            this.updateSquare( square, SQUARE_STATE.question, 
                              $square, IMAGE.question );
            this.minesLeft++;
            this.displayMinesCount();
            break;
          case SQUARE_STATE.opened:
            break;
        }       
      }
    },

    // Open a blank (or question) square revealing if it has a bomb or not
    handleOpen: function( square, $square ) {
      // Generate mines excluding the first position cleared
      if( this.noneOpened ) {
        this.generateMines( linearPosition(square.position) );
        this.noneOpened = false;
      }

      if( square.isMine ) {
        this.loseGame( $square );
      } else if ( square.adjacentMines === 0 ) {
        this.openMultiple( square, $square );
      } else {
        this.updateSquare( square, SQUARE_STATE.opened,
                          $square, IMAGE['open' + square.adjacentMines] );
        this.updateSquaresOpened();
      }
    },

    // If a Square to be opened has no mine adjacent to it, open the
    // square and all squares adjacent to it and so on until squares 
    // with adjacent mines are reached
    openMultiple: function( square, $square ) {
      var nextSquare,
          $nextSquare,
          neighbors,
          seen = [ linearPosition( square.position ) ],
          toOpen = [ linearPosition( square.position ) ];

      while( toOpen.length ) { // more squares to open
        nextSquare = this.squares[ toOpen.shift() ];
        $nextSquare = $( '#' + linearPosition(nextSquare.position) );

        if( nextSquare.adjacentMines === 0 ) {
          neighbors = nextSquare.neighborPositions();

          $.each( neighbors, function( index, neighbor ) {
            if( seen.indexOf( neighbor ) === -1 ) { // an unseen square
              seen.push( neighbor );
              toOpen.push( neighbor );
            }
          });
        }
        if( nextSquare.state === SQUARE_STATE.blank ||
            nextSquare.state === SQUARE_STATE.question ) {
          this.updateSquare( nextSquare, SQUARE_STATE.opened, $nextSquare,
                             IMAGE['open' + nextSquare.adjacentMines] );
          this.updateSquaresOpened();
        }
      }
    },

    // Update count of the number of squares that have been opened/cleared
    // This count is used to detect when the game is won
    updateSquaresOpened: function() {
      this.squaresOpened++;
      if( this.squaresOpened === 
        options.width * options.height - options.mines ) {
        this.winGame();
      }
    },

    // Make the gameboard and DOM reflect a change in the state of a square
    updateSquare: function( square, state, $square, image ) {
      square.state = state;
      $square.attr( 'src', image );
    },

    // Handle loss of a game (i.e, clicking a mine)
    loseGame: function( $squareMissed ) {
      var square, $square;
      // Show the positions of all mines that were not flagged
      for( var i = 0, len = options.mines; i < len; i++ ) {
        square = this.squares[ this.minePositions[i] ];
        $square = $( '#' + this.minePositions[i] );

        if( square.state === SQUARE_STATE.blank ||
            square.state === SQUARE_STATE.question ) {
          this.updateSquare( square, SQUARE_STATE.opened, 
                            $square, IMAGE.minerevealed );
        }
      }

      // Show the locations all misflagged mines (that is where the
      // player placed a flag, but there was no mine at that position)
      for( var i = 0, rows = options.height; i < rows; i++ ) {
        for( var j = 0, cols = options.width; j < cols; j++ ) {
          square = this.squares[ linearPosition([i, j]) ];
          if( square.state === SQUARE_STATE.flagged && !square.isMine ) {
            $square = $( '#' + linearPosition([i, j]) );
            this.updateSquare( square, SQUARE_STATE.opened, 
                              $square, IMAGE.minemisflagged );
          }
        }
      }

      // Show the position the player clicked a mine
      $squareMissed.attr( 'src', IMAGE.minedeath );
      $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facedead );

      this.endGame();
    },

    // Handle a player's win
    winGame: function() {
      var square, $square;
      // Flag any mine positions the player didn't
      for( var i = 0, len = options.mines; i < len; i++ ) {
        square = this.squares[ this.minePositions[i] ];
        $square = $( '#' + this.minePositions[i] );

        this.updateSquare( square, SQUARE_STATE.flagged, 
                          $square, IMAGE.flagged );
      }
      // Set up game status panel for a win
      this.minesLeft = 0;
      this.displayMinesCount();
      $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facewin );

      this.endGame();
    },

    // Stop timer and unbind board event listener at the end of a game
    endGame: function() {
      clearInterval( this.timerID );
      $( 'tbody' ).off( 'mousedown', 'img');
    },

    // End a game and initialize a new one
    restart: function() {
      this.endGame();
      $( '.face' ).find( 'img' ).attr( 'src', IMAGE.facesmile );
      this.initialize();
    },

    // Get input from player with a form and reset game options
    resetOptions: function() {
      var gametype = $('input[name="gametype"]:checked').val(),
          height   = parseInt( $('input[name="height"]').val(), 10 ),
          width    = parseInt( $('input[name="width"]').val(), 10 ),
          mines    = parseInt( $('input[name="mines"]').val(), 10 );

      switch( gametype ) {
        case 'beginner':
          this.setOptions( 9, 9, 10 );
          break;
        case 'intermediate':
          this.setOptions( 16, 16, 40 );
          break;
        case 'expert':
          this.setOptions( 16, 30, 99 );
          break;
        case 'custom':
          height = restrict( height, 4, 40 );
          width  = restrict( width,  8, 60 );
          mines  = restrict( mines,  1, (height * width - 1) );
          this.setOptions( height, width, mines );
          break;
      }
    },

    // Set game options according to a player's input
    setOptions: function( height, width, mines ) {
      options.height = height;
      options.width  = width;
      options.mines  = mines;
    }

  }; // end board

  // Constructor for a square on the Minesweeper board
  function Square( position ) {
    this.position = position;
    this.state = SQUARE_STATE.blank;
    this.isMine = false;
    this.adjacentMines = 0;
  }

  // Determine the positions (as a single number) of all squares
  // adjacent to a calling square
  Square.prototype.neighborPositions = function() {
    var newPos,
        validNeighbors = [],
        direction = {
          north: [-1, 0],
          south: [1, 0],
          east: [0, 1],
          west: [0, -1],
          nw: [-1, -1],
          ne: [-1, 1],
          se: [1, 1],
          sw: [1, -1],
        };
    for( var dir in direction ){
      newPos = [ this.position[0] + direction[dir][0],
                 this.position[1] + direction[dir][1] ];
      if ( isValidPosition( newPos ) ){
        validNeighbors.push( linearPosition( newPos ) );
      }
    }

    return validNeighbors;
  };

  return {
    board: board
  };

})();

$( document ).ready( function() {
  var setupPlayHandler = function() {
    $( 'tbody' ).on( 'mousedown', 'img', function( event ) {
      minesweeper.board.handlePlay( event.which, $(this) );
    });
  };

  minesweeper.board.initialize();

  $( '.game-container' ).on( 'contextmenu', function( event ) {
    event.preventDefault();
  });

  setupPlayHandler();

  $( '.face' ).on( 'click', 'img', function() {
    minesweeper.board.restart();
    setupPlayHandler();
  });

  $( '.menu' ).on( 'click', 'a', function( event ) {
    event.preventDefault();
    $( '.menu' ).find( 'form' ).fadeToggle( function() {
    });
  });

  $( '.menu' ).on( 'click', 'input[type="button"]', function() {
    minesweeper.board.resetOptions();
    $(this).closest( 'form' ).fadeOut();
    minesweeper.board.restart();
    setupPlayHandler();
  });

  $( document ).mouseup( function ( event ) {
    var $container = $( '.menu' );
    // if the target of the click isn't the container...
    if ( !$container.is( event.target ) &&
        // ... nor a descendant of the container
        $container.has( event.target ).length === 0 ) { 
      $( '#form' ).fadeOut();
    }
  });

});
