var imageUrl;
var image;

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

var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 32.805377,
      lng: -117.285576
    },
    zoom: 8
  });
  map.addListener('bounds_changed', function(e) {
    deleteMarkers();
    getPhotoData(map.getBounds());
  });
  infoWindow = new google.maps.InfoWindow();
};

var addMarkers = function(results) {
  var photoLocation, marker, imgHTML;
  $.each(results.photo, function(i, photo) {
    imgHTML = "<img src=" + 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg' + " alt=" + photo.title + "/>";
    photoLocation = new google.maps.LatLng(photo.latitude, photo.longitude);
    marker = new google.maps.Marker({
      position: photoLocation,
      map: map,
      animation: google.maps.Animation.DROP,
    });
    markers.push(marker);
    setInfoWindowContent(marker, imgHTML)
  });

};

var setInfoWindowContent = function(marker, content) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  });
};

var deleteMarkers = function() {
  for (i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
};


$(document).ready(function() {


  initMap();
});
