var section = $('li');
var needToAddPhotos = true;

function toggleAccordion() {
  section.removeClass('active');
  $(this).addClass('active');
}

// section.on('click', toggleAccordion);

section.on('click', function(){
  section.removeClass('active');
  $(this).addClass('active');
  if($(this)[0].className.includes("photoli") && needToAddPhotos){
    setTimeout(function(){
      appendPhotos(15);
      needToAddPhotos = false;
    }, 500); //wait as long as the slide transition defined in css
  }
});


// For Photos
var all_photos = []

var flickerAPI = "https://api.flickr.com/services/rest/?&method=flickr.people.getPhotos&api_key=41dd3aff041c00c52febdef9786a9ca0&user_id=139169754@N02&format=json&nojsoncallback=1";
$.getJSON(flickerAPI, {
  format: "json"
}, function( data ) {
  //just to get more random pages
  var num = Math.floor(Math.random() * data.photos.pages);
  setAllPhotos(num);
});


function setAllPhotos(page_num){
  flickerAPI= "https://api.flickr.com/services/rest/?&method=flickr.people.getPhotos&api_key=41dd3aff041c00c52febdef9786a9ca0&user_id=139169754@N02&format=json&nojsoncallback=1&page=" + page_num;
  $.getJSON(flickerAPI, {
  format: "json"
  }, function( data ) {
    all_photos = data.photos.photo;
    console.log("Set");
  })
}

// create <div class="grid-item"></div>
function getItemElement(num) {
  var elem = document.createElement('div');
  elem.className = 'item ';
  var img = document.createElement("img");
  var p = all_photos[num];
  var url = "https://farm" + p.farm + ".staticflickr.com/" + p.server + "/" + p.id + "_" + p.secret + "_z.jpg"
  img.setAttribute("src", url);
  all_photos.splice(num, 1);
  elem.appendChild(img)
  return elem;
}

function appendPhotos(num){
  if(all_photos.length > 0){
    var photos = []
    for(i = 0; i < num; i++){
      var rand = Math.floor(Math.random() * all_photos.length)
      photos.push(getItemElement(rand))
    }
    var $items = $(photos)
    // hide by default
    $items.hide();
    // append to container
    $container.append( $items );
    $items.imagesLoaded().progress( function( imgLoad, image ) {
      // get item
      // image is imagesLoaded class, not <img>
      // <img> is image.img
      var $item = $( image.img ).parents('.item');
      // un-hide item
      $item.show();
      // masonry does its thing
      $container.masonry( 'appended', $item );
    });
    $('#container').masonry('layout');
  }
}

var $container = $('#container').masonry({
  itemSelector: '.item',
  columnWidth: 1
});

var d = $('.photo');

function photoScroll(){
  if(d.scrollTop() >= (document.getElementById("photo").scrollHeight - d.height() - 50)){
    appendPhotos(2);
  }
}
