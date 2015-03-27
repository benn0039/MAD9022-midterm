




contact.prototype.displayMap = function(userLat, userLong) {
    var mapPage = document.querySelector('#map');
    var contactPage = document.querySelector('#contact_list'); 
    
    // if no lat and long data.... 
    if(!this.lat && !this.long) {
        mapPage.style.display = "block";
        contactPage.style.display = 'none'
        hasGeo();
        alert("There is no data for this contact. double tap on location to set latitude and longitude");
        
    } else {
        mapPage.style.display = "block";
        contactPage.style.display = 'none'; 
        hasGeo();
    }
    
     function hasGeo() {
        if (navigator.geolocation) {
            params = { enableHighAccuracy: true, timeout: 3600, maximumAge: 0 };
            navigator.geolocation.getCurrentPosition(map, gpsError, params);
        } else {
            showError();
        }
    }
    
    function showError() {
        alert('Location services not supported');
    }
    
    function gpsError(error) {
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    }
    
    function map(position) {
        var mapCentre = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var mapOptions ={
            center:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            zoom:14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        var map = new google.maps.Map(document.getElementById("map_content"), mapOptions);

        var marker = new google.maps.Marker({
	       position: mapCentre,
	       animation: google.maps.Animation.DROP,
	       title: "TITLE"
            });
            marker.setMap(map);

            google.maps.event.addListener(map, 'click', function( event ){
            alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
            });
    }
}

// loop for each record in contacts max = 12
var dudes = [];
for (var i = 0; i<75; i++) {
    dudes[i] = (new contact(i,"Tina"+i, [{"type" : "home", "value" : "345"}]));
    dudes[i].makeDOMElement();
}

var superString = JSON.stringify(dudes);

if (localStorage) {
    
    localStorage.setItem("contacts", superString);
    
} else {
    alert("Local Storage is not supported.  Exercise will not work as required");
}
