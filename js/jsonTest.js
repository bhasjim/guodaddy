var apiurl = "https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=65030e1f766ba9dccb6deb836165ca4a&user_id=129194286@N08&format=json";
var imageUrl;
var image;
console.log("hello");

$(document).ready(function () {
  $('#get-data').click(function () {
    var showData = $('#show-data');
    $.getJSON(apiurl + "&jsoncallback=?", function (data) { //need that &jsoncallback
      console.log(data);
      console.log(data.photos.photo.length);

      $.each(data.photos.photo, function(index, value){
        imageUrl = "http://farm" + data.photos.photo[index].farm + ".static.flickr.com/" + data.photos.photo[index].server + "/"+data.photos.photo[index].id + "_"+data.photos.photo[index].secret + ".jpg";
        var image = document.createElement("img");
        image.src = imageUrl;

        //document.getElementById("show-data").appendChild(elem);
        showData.append(image); //does same as above


      });

    });
  });
});
