// Image Carousel/Slider
var carousel = (function() {

  // Constants
  var WIDTH           = 640,
      INTERVAL        = 5000,
      NUM_OF_IMAGES   = 5,
      TRANSITION_TIME = 750;

  // Variables
  var curImageNum   = 1,
      $allImages    = $( '.all-images' ),
      $activeNavDot = $( '.nav-dots' ).find( '.active' ),
      timerID;

  var startCarousel = function() {
    timerID = setInterval( next, INTERVAL );
  };

  var stopCarousel = function() {
    clearInterval( timerID );
  };

  var resetCarousel = function() {
    stopCarousel();
    startCarousel();
  };

  // Get the next image's number, accounting for wrapping
  var getNextImgNum = function() {
    return ( (curImageNum + 1) > NUM_OF_IMAGES ) ? 1 : curImageNum + 1;
  };

  // Get the previous image's number, accounting for wrapping
  var getPrevImgNum = function() {
    return ( (curImageNum - 1) < 1 ) ? NUM_OF_IMAGES : curImageNum - 1;
  };

  // Switch Nav Dot
  var updateNavDot = function() {
    $activeNavDot.removeClass( 'active' );
    $activeNavDot = $( '.nav-dots ' ).find('[value="' + curImageNum + '"]');
    $activeNavDot.addClass( 'active' );
  };

  // Move to the next Image
  var next = function() {
    $allImages.animate( 
      { 'left': '-=' + WIDTH + 'px' }, TRANSITION_TIME, function() {
        // This callback function will run after the code below which 
        // updates the curImageNum and nav dot.
        if ( curImageNum === 1 ) {
          $allImages.css( 'left', '-' + WIDTH + 'px' );
        }
        updatePreview();
      });

    curImageNum = getNextImgNum();
    updateNavDot();
  };

  // Move to the previous Image
  var previous = function() {
    $allImages.animate( 
      { 'left': '+=' + WIDTH + 'px' }, TRANSITION_TIME, function() {
        // This callback function will run after the code below which 
        // updates the curImageNum and nav dot.
        if ( curImageNum === NUM_OF_IMAGES ) {
          $allImages.css( 'left', '-' + ( WIDTH * NUM_OF_IMAGES ) + 'px' );
        }
        updatePreview();
      });

    curImageNum = getPrevImgNum();
    updateNavDot();
  };

  // Move to the Specified Image
  var gotoImage = function( imgNumber ) {
    imgNumber = +imgNumber;
    if ( curImageNum === imgNumber ) {
      return;
    }
    curImageNum = imgNumber;
    updateNavDot();

    $allImages.animate( { 'left': '-' + ( WIDTH * curImageNum ) + 'px' }, 
                        TRANSITION_TIME );
  };

  // Update preview image when it is visible and the main image changes
  var updatePreview = function() {
    if ( $( '.right' ).find( '.preview' ).is( ':visible' ) ) {
      previewNext();
    }
    if ( $( '.left' ).find( '.preview' ).is( ':visible' ) ) {
      previewPrev();
    }
  };

  // Show a small preview of the previous image
  var previewNext = function() {
    var nextImgNum = getNextImgNum();
    var $nextImg = $( '#img' + nextImgNum ).clone().addClass( 'img-preview' );
    removePreview();
    $( '.right' ).find( '.preview' ).append( $nextImg ).show();
  };

  // Show a small preview of the next image
  var previewPrev = function() {
    removePreview();
    var prevImgNum = getPrevImgNum();
    var $prevImg = $( '#img' + prevImgNum ).clone().addClass( 'img-preview' );
    $( '.left' ).find( '.preview' ).append( $prevImg ).show();
  };

  // Remove all small image previews
  var removePreview = function() {
    $( '.preview' ).empty().hide();
  };

  return {
    next         : next,
    previous     : previous,
    gotoImage    : gotoImage,
    previewNext  : previewNext,
    previewPrev  : previewPrev,
    removePreview: removePreview,
    startCarousel: startCarousel,
    resetCarousel: resetCarousel
  };
})();

// Listen for and handle relevant events
$( document ).ready( function() {
  carousel.startCarousel();

  $( '.right > img' ).on( 'click', function() {
    carousel.next();
    carousel.resetCarousel();
  }).hover( carousel.previewNext, carousel.removePreview );

  $( '.left > img' ).on( 'click', function() {
    carousel.previous();
    carousel.resetCarousel();
  }).hover( carousel.previewPrev, carousel.removePreview );

  $( '.nav-dots' ).on( 'click', 'div', function() {
    carousel.gotoImage( $( this ).attr( 'value' ) );
    carousel.resetCarousel();
  });
});
