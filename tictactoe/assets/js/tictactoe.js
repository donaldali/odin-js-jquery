// Tic Tac Toe
var tictactoe = (function() {
  // Constants
  var X = 'X',
      O = 'O',
      BLANK = ' ';

  // Variables
  var curPlayer = X,
      moves = 0,
      board = [ BLANK, BLANK, BLANK, BLANK, BLANK, 
                BLANK, BLANK, BLANK, BLANK ];

  var displayMessage = function( message ) {
    $( '.message' ).html( message );
  };

  var switchPlayer = function() {
    curPlayer = ( curPlayer === X ) ? O : X;
    displayMessage( 'Current Player: ' + curPlayer );
  };

  var isValidMove = function( index ) {
    if ( board[ index ] === BLANK ) {
      return true;
    } else {
      displayMessage( 'Select a blank board position' );
      return false;
    }
  };

  var makeMove = function( $square, index ) {
    board[ index ] = curPlayer;
    $square.html( curPlayer );
    moves++;
  };

  // Check if the game is over. If a player has won, return the 3 squares
  // on which the win occurred as an array. If the game is a draw, return
  // true; if the game is not over, return false
  var gameOver = function() {
    var winCombinations = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ],
        winIndex = -1;
    $.each( winCombinations, function( index, winCombination ) {
      if( allEqual( winCombination ) ){
        winIndex = index;
        return false;
      }
    });
    if( winIndex !== -1 ) {
      return winCombinations[ winIndex ];
    } else if ( moves === 9 ) {
      return true; // Draw
    } else {
      return false;
    }
  };

  // Check if the board pieces at 3 board indexes are the same (that is, 
  // if they are all X or all O)
  var allEqual = function( indexes ) {
    return ( board[ indexes[0] ] === board[ indexes[1] ] ) &&
           ( board[ indexes[0] ] === board[ indexes[2] ] ) &&
           ( board[ indexes[0] ] !== BLANK );
  };

  // Handle the end of the game by setting and displaying an appropriate
  // message (including the winning formation, if one exists), then
  // allowing the user to play again
  var endGame = function( endFormation ) {
    var endMessage;

    if( $.isArray(endFormation) ){
      endMessage = 'Game Over.  Player ' + curPlayer + ' Wins';
      showWinFormation( endFormation );
    } else {
      endMessage = 'Game Over.  Draw Game';
    }
    $( '.message' ).addClass( 'end-message' );
    displayMessage( endMessage );

    // Turn off gameboard click listener
    $('.gameboard').off('click');
    $( '.play-again' ).show().on( 'click', function() {
        location.reload();
    });

  };

  // Add a class to highlight the squares that form a winning formation
  var showWinFormation = function( formation ) {
    $.each( formation, function( index, winPosition ) {
      $( '.square' ).eq( winPosition ).addClass(' winning-square ');
    });
  };

  // Main controller to run the game
  var play = function( $square ) {
    var index = +$square.attr( 'id' );

    if( isValidMove( index ) ){
      makeMove( $square, index );
      var winningFormation = gameOver();

      ( winningFormation ) ? endGame( winningFormation ) : switchPlayer();
    }
  };

  return { play: play };

})();

$( document ).ready( function() {
  $( '.gameboard' ).on( 'click', '.square', function() {
    tictactoe.play( $(this) );
  });
});
