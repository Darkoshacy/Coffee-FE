var output = document.getElementById("out");
var venue = [];
const panel3 = document.getElementById("panel3");
const arrows = document.getElementById("arrows");
const message = document.getElementById("message");


function start(){
  confirmGeolocation();
};

function toggleOpen() {
      this.classList.toggle('open');
    }

function toggleActive(e) {

      if (e.propertyName.includes('flex')) {
        this.classList.toggle('open-active');
      }
    }

function panelOpen(){
      panel3.classList.add('open');
      document.getElementById('arrows').style.display = "inline";
    }

function panelClose(){
      panel3.classList.remove('open');
            document.getElementById('arrows').style.display = "none";
    }

function checkNameOver (){

      const panels = document.querySelectorAll('.panel');
      const coffeShopsNames = document.querySelectorAll('.coffeNames');
      const coffeShopsPanel = document.querySelectorAll('.horPanel');
      const sortDistance = document.querySelector(".distance");
      const sortPriceRange = document.querySelector(".price");

      coffeShopsPanel.forEach(coffePanel => coffePanel.addEventListener('mouseover', addBack));
      coffeShopsPanel.forEach(coffePanel => coffePanel.addEventListener('mouseout', removeBack));
      coffeShopsNames.forEach(coffeName => coffeName.addEventListener('click', caffeDetail));
      arrows.addEventListener('click', panelClose);
      sortDistance.addEventListener('click', distSort);
      sortPriceRange.addEventListener('click', priceSort);

      //panels.forEach(panel => panel.addEventListener('click', toggleOpen));
      //panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));
    }

function addBack() {
      this.classList.add('darkback');
    }

function removeBack() {
      this.classList.remove('darkback');
    }

function caffeDetail(){
      panelOpen();
      document.getElementById('naslov').innerHTML = venue.find(naziv => naziv.id == this.dataset.id).name;
      dajSlike(this.dataset.id);
    }

function confirmGeolocation(){
  if(confirm("This app requires access to Your geolocation info!")){
      geoFindMe();
  }else{
      document.getElementById('message').innerHTML = '<p>This app requires access to Your geolocation info!!! </br>Please refresh Your browser.</p>';
  };
};

function geoFindMe() {


  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  };

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    nearShops(latitude, longitude); 
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location!!!";
  };


  navigator.geolocation.getCurrentPosition(success, error);
};


function distSort(){

    var ordered = venue.sort((a,b) => a.distance < b.distance ? 1 : -1);
    makeOuput();
    
};

function priceSort(){

    var ordered = venue.sort((a,b) => a.price < b.price ? 1 : -1);
    makeOuput();

}

function nearShops(latitude, longitude){
    var ourRequest = new XMLHttpRequest();
    ourRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        //   console.log('ok');
        };
    };

//ourRequest.open('GET', 'https://api.foursquare.com/v2/venues/search?v=20170724&ll=' + latitude + '%2C%20' + longitude + '&query=caffe&intent=checkin&client_id=XVMLJDIBKKLNC1WGO4MRKDYS1V1HGTYMY2HMZE3A4QZMXBV3&client_secret=DUZSPKBZMYX4BX2UYE0D54ZOPV4KUJOD42JSLMAUZNAZTQ4L');
ourRequest.open('GET', 'https://api.foursquare.com/v2/venues/explore?v=20131016&ll=' + latitude + '%2C%20' + longitude + '&radius=50000&section=coffee&novelty=new&client_id=XVMLJDIBKKLNC1WGO4MRKDYS1V1HGTYMY2HMZE3A4QZMXBV3&client_secret=DUZSPKBZMYX4BX2UYE0D54ZOPV4KUJOD42JSLMAUZNAZTQ4L');
ourRequest.onload = function(){
  var ourVenues = [];
  var ourData = JSON.parse(ourRequest.responseText);

  for (var i = 0; i < ourData.response.groups[0].items.length; i++) {
    ourVenues.push(ourData.response.groups[0].items[i].venue);
    } 

  for (i = 0; i < ourVenues.length; i++){
    if(typeof ourVenues[i].hours == 'undefined' || typeof ourVenues[i].price == 'undefined' ) {

      i++;}else{
      if(ourVenues[i].hours.isOpen){
    venue.push({"id": ourVenues[i].id, "name":ourVenues[i].name,"distance":ourVenues[i].location.distance, "price":ourVenues[i].price.tier});
  }}};

  makeOuput();
  }
ourRequest.send();
}

function dajSlike(imgId){

var imgRequest = new XMLHttpRequest();
    imgRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          // console.log('Sve OK');
        }
    };

imgRequest.open('GET','https://api.foursquare.com/v2/venues/' + imgId + '/photos?v=20170724&group=venue&limit=1&client_id=XVMLJDIBKKLNC1WGO4MRKDYS1V1HGTYMY2HMZE3A4QZMXBV3&client_secret=DUZSPKBZMYX4BX2UYE0D54ZOPV4KUJOD42JSLMAUZNAZTQ4L');

imgRequest.onload = function(){
  var imgData = JSON.parse(imgRequest.responseText);
  var imgVenues = [...imgData.response.photos.items];

  if (imgVenues.length){
    document.getElementById('imgCaffe').src=(imgVenues[0].prefix + 'width' + imgVenues[0].width + imgVenues[0].suffix);
  }
};
 
imgRequest.send();
}

function makeOuput(){
var dataStr = "<div class='horPanel headRow'><div class='distance'>Sort by distance</div><div class='naslovi'></div><div class='price' >Sort by price range</div></div>";
  for (var i=0; i < 10 && i < venue.length; i++){
      dataStr += "<div class='horPanel'><div class='distance' ><img id='footImg' src='images/Foot-clip-art-images-illustrations-photos-4.png'>" + venue[i].distance + "m </div><div class='naslovi'><p class = 'coffeNames' data-id='" + venue[i].id + "'>" + venue[i].name + "</p></div><div class='price'>" + venue[i].price + "</div></div>";
        };
      document.querySelector('.panel2').innerHTML = dataStr;
      checkNameOver();
}
