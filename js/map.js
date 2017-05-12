var imageUrl;
var image;
var infoWindow;
var markerClusterer = null;

var apiParams = { //parameters for API calls
  "key": "65030e1f766ba9dccb6deb836165ca4a",
  "max_upload_date": "1493856000",
  "bbox": [-117.285576,32.805377,-117.185326,32.896597]
}
var searchURL  = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=65030e1f766ba9dccb6deb836165ca4a"+"&max_upload_date=" + apiParams.max_upload_date + "&bbox="+apiParams.bbox +"&accuracy=6&has_geo=1&extras=geo&format=json";
console.log("bbox lolol: " + apiParams.bbox)
var searchURL  = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key="+ apiParams.key +"&max_upload_date=" + apiParams.max_upload_date + "&bbox="+apiParams.bbox +"&accuracy=6&has_geo=1&extras=geo&format=json";
var markers = [];

var getPhotoData = function(bounds) {
      console.log(bounds.getSouthWest().toString());
      var params = {
        format: "json",
        apiKey: "4cd3d05ce08d3d4fa414116b3e3c247e"
      }
      var bbox = bounds.toJSON();
      var bboxString = bounds.toString().replace(/\(/g,"");
      var bboxString = bounds.getSouthWest().lng().toString() + "," + bounds.getSouthWest().lat().toString() + "," + bounds.getNorthEast().lng().toString() + "," + bounds.getNorthEast().lat().toString();
      console.log("hey: " + bboxString);
      var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" +
        apiParams.key + "&bbox=" + bboxString + "&has_geo=1&extras=geo&format=json&jsoncallback=?";
      $.getJSON(url, params, function(data) {
        addMarkers(data.photos);
      });
    };

var map, errorWindow;
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
        zoom: 12
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
        $('#locationInfo').slideDown();
      });

      


      map.addListener('idle', function(e) {
        deleteMarkers();  // clears map
        if (markerClusterer) {    // clears clusters
          markerClusterer.clearMarkers();
        }
        getPhotoData(map.getBounds());

      });
      infoWindow = new google.maps.InfoWindow();
      markerClusterer = new MarkerClusterer(map, markers, {imagePath: './../images/m'})

    }, function() {
      handleLocationError(true, errorWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, errorWindow, map.getCenter());
  }
}
  $('#closeLoc').on('click', function(){
    $('#locationInfo').slideUp();
    $('#locationInfo').removeClass('locOpen');
    $('#locationInfo').addClass('locClose');
  });

  $('#openLoc').on('click',function(){
    $('#locationInfo').removeClass('locClose');
    $('#locationInfo').addClass('locOpen');
    });

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
    var fireImage = new google.maps.MarkerImage('./../images/fire.png',
      null, // size
      null, // origin
      new google.maps.Point( 0, 0 ), // anchor (move to center of marker)
      new google.maps.Size( 17, 17 )); // scaled size (required for Retina display icon)
    imgHTML = "<img src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg' + " alt=" + photo.title + "/>";
    photoLocation = new google.maps.LatLng(photo.latitude, photo.longitude);
    marker = new google.maps.Marker({icon:fireImage,position: photoLocation,map:map});

    marker.addListener('click', function() {
      $('#locationInfo').slideDown();
    });

    $('#closeLoc').on('click', function(){
      $('#locationInfo').slideUp();
      $('#locationInfo').removeClass('locOpen');
      $('#locationInfo').addClass('locClose');
    });

    $('#openLoc').on('click',function(){
      $('#locationInfo').removeClass('locClose');
      $('#locationInfo').addClass('locOpen');
    });
    markers.push(marker);
    setInfoWindowContent(marker, imgHTML)
  });

};

var setInfoWindowContent = function(marker, content) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(content);
    //$('#show-data').append(content);
    infoWindow.open(map, marker);
  });
};

var deleteMarkers = function() {
  for (i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
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
