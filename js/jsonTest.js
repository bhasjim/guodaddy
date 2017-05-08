var imageUrl;
var image;

var apiParams = { //parameters for API calls
  "max_upload_date": "1493856000",
  "bbox": [-117.285576,32.805377,-117.185326,32.896597]
}

var searchURL  = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=65030e1f766ba9dccb6deb836165ca4a"+"&max_upload_date=" + apiParams.max_upload_date + "&bbox="+apiParams.bbox +"&accuracy=6&has_geo=1&extras=geo&format=json";
console.log("hello");

$(document).ready(function () {
  $('#get-data').click(function () {
    var showData = $('#show-data');
    $.getJSON(searchURL + "&jsoncallback=?", function (data) { //need that &jsoncallback
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
