// Working with Google Maps API
var googleMaps = (function( $ ) {
  var map,
      infoWindow;

  // Create Map and InfoWindow to be used on Map
  var initialize = function() {
    var mapProperty = {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map( $( '#map' ).get( 0 ), mapProperty );
    infoWindow = new google.maps.InfoWindow({
      maxWidth: 300
    });

    handleFormInput();
  };

  // Validate form and handle a form submission
  var handleFormInput = function() {
    $( 'form' ).validate({
      submitHandler: function( form ) {
        addMarker( getFormInput() );
        form.reset();
        return false;
      }
    });
  };

  // Create a Marker from the user's provided form data
  var addMarker = function( data ) {
    var marker = new google.maps.Marker({
      position: { lat: data.latitude, lng: data.longitude },
      animation: google.maps.Animation.DROP,
      map: map,
      title: data.message
    });
    map.panTo( marker.getPosition() );

    setupMarkerListener( marker );
  };

  // Handle a click event on a marker ( using a closure )
  var setupMarkerListener = function( marker ) {
    google.maps.event.addListener( marker, 'click', (function( marker ) {
      return function() {
        infoWindow.close();

        if( marker.title ) {
          wrapInfoWindowContent( infoWindow, marker.title );
          infoWindow.open( map, marker );
        }
        map.panTo( marker.getPosition() );
      };
    })( marker ) );
  };

  // Wrap content in a div before making it an InfoWindow's content
  var wrapInfoWindowContent = function( infoWindow, content ) {
    content = '<div class="info-wrapper">' + content + '</div>';
    infoWindow.setContent( content );
  };

  // Get form information used to make a Google Maps marker
  var getFormInput = function() {
    var latitude  = parseInt( $('input[name="latitude"]').val(), 10 ),
        longitude = parseInt( $('input[name="longitude"]').val(), 10 ),
        message   = $('input[name="message"]').val();

    return {
      latitude:  restrict( latitude, -90, 90 ),
      longitude: restrict( longitude, -180, 180 ),
      message:   message.trim()
    };
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

  return { initialize: initialize };
})( jQuery );

$( googleMaps.initialize );
