$( document ).ready( function() {
  // Set up Restaurant page
  var header = '<header>' +
                 '<img src="assets/images/restaurant.jpg">' +
                 '<h1>Monk\'s Restaurant</h1>' +
               '</header>',
      nav = '<nav>' +
              '<ul>' +
                '<li><a href="#" id="home" class="focus">Home</a></li>' +
                '<li><a href="#" id="menu">Menu</a></li>' +
                '<li><a href="#" id="contact">Contact</a></li>' +
              '</ul>' +
            '</nav>',
      section = '<section>' +
                  '<div id="home-content">' +
                    '<p>Welcome to Monk\'s Restaurant, a restaurant about ' +
                    'nothing...except of course, serving great food and ' +
                    'providing a place to hang out and do nothing.</p>' +
                  '</div>' +

                  '<div id="contact-content" class="hidden">' +
                    '<p><address>Corner of West 112th Street and Broadway ' +
                    '(near Columbia University) in NYC</address></p>' +
                  '</div>' +

                  '<div id="menu-content" class="hidden">' +
                    '<ul>' +
                      '<li>Egg White Omelette</li>' +
                      '<li>Big Salad</li>' +
                      '<li>Tuna on Toast</li>' +
                    '</ul>' +
                  '</div>' +
                '</section>',
      $content = $( "#content" );

  $content.append( header ).append( nav ).append( section );

  var $home    = $( '#home' ),
      $menu    = $( '#menu' ),
      $contact = $( '#contact' ),
      $homeDiv    = $( '#home-content' ),
      $menuDiv    = $( '#menu-content' ),
      $contactDiv = $( '#contact-content' );


  // Handle clicks of Navigation items
  $home.click( function( event ) {
    event.preventDefault();

    handleFocus( $home, $menu, $contact );
    handleDisplay( $homeDiv, $menuDiv, $contactDiv );
  });

  $menu.click( function( event ) {
    event.preventDefault();

    handleFocus( $menu, $home, $contact );
    handleDisplay( $menuDiv, $homeDiv, $contactDiv );
  });

  $contact.click( function( event ) {
    event.preventDefault();

    handleFocus( $contact, $home, $menu );
    handleDisplay( $contactDiv, $homeDiv, $menuDiv );
  });


});

var handleFocus = function( $add, $remove1, $remove2 ) {
  $add.addClass( 'focus' );
  $remove1.removeClass( 'focus' );
  $remove2.removeClass( 'focus' );
};

var handleDisplay = function( $show, $hide1, $hide2 ) {
  $show.show();
  $hide1.hide();
  $hide2.hide();
};
