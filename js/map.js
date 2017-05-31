var imageUrl;
var image;
var infoWindow;
var markerClusterer = null;
var chicago = {lat: 41.85, lng: -87.65};
var map, errorWindow;





var apiParams = { //parameters for API calls
  "key": "65030e1f766ba9dccb6deb836165ca4a",
  "max_upload_date": "1493856000",
  "bbox": [-117.285576,32.805377,-117.185326,32.896597],
  "tags":[]
}
var markers = [];
var params = {
        format: "json",
        apiKey: "4cd3d05ce08d3d4fa414116b3e3c247e"
      }


//add listener and loop through tags to add to url
$('input').on('itemAdded', function(event) {
  // event.item: contains the item
  //push tag to array of tags
  apiParams.tags.push(event.item);
  deleteMarkers();  // clears map
  if (markerClusterer) {    // clears clusters
    markerClusterer.clearMarkers();
  }
  if(map){
    getPhotoData(map.getBounds());
  }
});


$('input').on('itemRemoved', function(event) {
  // event.item: contains the item
  //remove tag from array of tags
  //get index of the item and remove it
  var index = apiParams.tags.indexOf(event.item);
  if (index > -1) {
    apiParams.tags.splice(index, 1);
  }
  //refresh the map
  deleteMarkers();  // clears map
  if (markerClusterer) {    // clears clusters
    markerClusterer.clearMarkers();
  }
  if(map){
    getPhotoData(map.getBounds());
  }
});

var getPhotoData = function(bounds) {
      console.log(bounds.getSouthWest().toString());

      var bbox = bounds.toJSON();
      var bboxString = bounds.toString().replace(/\(/g,"");
      var bboxString = bounds.getSouthWest().lng().toString() + "," + bounds.getSouthWest().lat().toString() + "," + bounds.getNorthEast().lng().toString() + "," + bounds.getNorthEast().lat().toString();
      var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
        apiParams.key + "&bbox=" + bboxString + "&tags="+ apiParams.tags + "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
      $.getJSON(url, params, function(data) {
        addMarkers(data.photos);
      });
    };
function initMap() {
  var image = new google.maps.MarkerImage(
              './../images/bluedot_retina.png',
              null, // size
              null, // origin
              new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
              new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
            );

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 12,
        styles: [
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e9e9e9"
                },
                {
                    "lightness": 17
                }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 20
                }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 17
                }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 18
                }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 21
                }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dedede"
                },
                {
                    "lightness": 21
                }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#333333"
                },
                {
                    "lightness": 40
                }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f2f2f2"
                },
                {
                    "lightness": 19
                }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 20
                }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
          }
        ]

      });

      errorWindow = new google.maps.InfoWindow;

                // then create the new marker
      var locMarker = new google.maps.Marker({
        flat: true,
        icon: image,
        map: map,
        optimized: false,
        position: pos,
        title: 'I might be here',
        visible: true
      });

      locMarker.addListener('click', function() {
        // $('#locationInfo').slideDown();
      });




      map.addListener('idle', function(e) {
        deleteMarkers();  // clears map
        if (markerClusterer) {    // clears clusters
          markerClusterer.clearMarkers();
        }
        getPhotoData(map.getBounds());

      });
      infoWindow = new google.maps.InfoWindow({disableAutoPan : true});
      markerClusterer = new MarkerClusterer(map, markers, {imagePath: './../images/m', minimumClusterSize: 4, maxZoom: 20})

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);


      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });

    }, function() {
      if(!map){
        handleLocationError(true, errorWindow, map.getCenter());
      }
    });
  } else {
    // Browser doesn't support Geolocation
    if(!map){
      handleLocationError(false, errorWindow, map.getCenter());
    }

  }
}


  // $('#closeLoc').on('click', function(){
  //   $('#locationInfo').slideUp();
  //   $('#locationInfo').removeClass('locOpen');
  //   $('#locationInfo').addClass('locClose');
  // });

  // $('#openLoc').on('click',function(){
  //   $('#locationInfo').removeClass('locClose');
  //   $('#locationInfo').addClass('locOpen');
  //   });

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

var addMarkers = function(results) {
  var photoLocation, marker, imgHTML;
  $.each(results.photo, function(i, photo) {
    var photoMarker = new google.maps.MarkerImage('./../images/cameralol.png',
      null, // size
      null, // origin
      new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
      new google.maps.Size( 20, 20 )); // scaled size (required for Retina display icon)
    imgHTML = "<img data-title='" + photo.title + "' src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg' + " alt=" + photo.title + "/>";
    photoLocation = new google.maps.LatLng(photo.latitude, photo.longitude);
    marker = new google.maps.Marker({icon:photoMarker,position: photoLocation,map:map});

    marker.addListener('click', function() {
      // $('#locationInfo').slideDown();
      $('#photoModal').modal('show');
    });

    // $('#closeLoc').on('click', function(){
    //   $('#locationInfo').slideUp();
    //   $('#locationInfo').removeClass('locOpen');
    //   $('#locationInfo').addClass('locClose');
    //   $('#show-data').hide();
    // });

    // $('#openLoc').on('click',function(){
    //   $('#locationInfo').removeClass('locClose');
    //   $('#locationInfo').addClass('locOpen');
    //   $('#show-data').show();
    // });w
    markers.push(marker);
    setInfoWindowContent(marker, imgHTML, results, photo)
  });
  markerClusterer.addMarkers(markers);
};

var setInfoWindowContent = function(marker, content,results, photo) {
  google.maps.event.addListener(marker, 'click', function() {
    //infoWindow.setContent(content);
    $('#main-pic-header').empty()
    $('#main-pic').empty();
    $('#gallery-pic').empty();
    $('#main-pic-header').append(photo.title);
    $('#main-pic').append(content);
    console.log(photo);

    nearbyPictures(marker, results);
    //infoWindow.open(map, marker);
  });
};

function nearbyPictures(marker, photos){
  var lat = marker.internalPosition.lat();
  var lon = marker.internalPosition.lng();
  const mbbox = (lon - 0.0005) + "," + (lat - 0.0005) + "," + (lon + 0.0005) + "," + (lat + 0.0005)
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
        apiParams.key + "&bbox=" + mbbox + "&tags="+ apiParams.tags + "&sort=interestingness-desc&has_geo=1&extras=geo&format=json&jsoncallback=?";
  $.getJSON(url, params, function(data) {
    $.each(data.photos.photo, function(i, photo) {
      imgHTML = "<img class=\"grid-pic\" data-title='" + photo.title + "' src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg' + " alt=" + photo.title + "/>";
      $('#gallery-pic').append(imgHTML);
    });

  });

}

$(document).on('click', '.grid-pic',function(){
  $('#main-pic-header').empty();
  $('#main-pic').empty();
  $('#main-pic-header').append($(this).data('title'));
  source = $(this)[0].src;
  source = source.substring(0, source.length - 5)
  $('#main-pic').append("<img src='" + source + "z.jpg' />");
  $('#photoModal').scrollTop(0);
});

var deleteMarkers = function() {
  for (i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
  markers = [];
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


$(document).ready(function() {
  initMap();
});


/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    map.setCenter(chicago);
  });

}
