var url = "https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=65030e1f766ba9dccb6deb836165ca4a&user_id=48659894@N03";

console.log("hello");

$(document).ready(function () {
  $('#get-data').click(function () {
    var showData = $('#show-data');
    $.getJSON(url + "&format=json&jsoncallback=?", function (data) { //need that &jsoncallback
      console.log(data);
      showData.text(data)
    });
  });
});
