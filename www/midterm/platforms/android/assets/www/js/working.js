var contact1 = function(id, name){
    this.id = id;
    this.name = name;
    this.phone = "";
    this.lat = "";
    this.long = "";
}

contact1.prototype.makeDOMElement = function() {
    var list = document.querySelector("#contact_list"),
        newContactDiv = document.createElement("div"),
        newContact = document.createElement("h2");
    
    newContactDiv.setAttribute('class', 'contact');
    newContactDiv.setAttribute('id', this.id);
    newContactDiv.addEventListener("dblclick", this.displayContactInfo);
//    newContactDiv.addEventListener("click", this.displayMap);
    newContact.setAttribute('class', 'name');
    newContact.textContent = this.name;
    newContactDiv.appendChild(newContact);
    list.appendChild(newContactDiv);
}

contact1.prototype.displayContactInfo = function() {
    var dialog = document.querySelector('[data-role="dialog"]');
    dialog.setAttribute('class', 'dialogActive');
    this.dialogMessage = document.querySelector("#dialogMessage");
    this.dialogMessage.innerHTML = dudes[this.id].name + " " + dudes[this.id].phone[0].type + " " + dudes[this.id].phone[0].value + "  " + this.id;
    this.okBtn = document.querySelector("#btn");
    this.okBtn.addEventListener('click', function(){dialog.removeAttribute('class', 'dialogActive');});
}

contact1.prototype.displayMap = function(userLat, userLong) {
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
            params = { enableHighAccuracy: true, timeout: 6600, maximumAge: 0 };
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
        // load map centered on user coords.    need navigator.geolocation........
        //addEventListener for double tap. 
        //get coords, add to dudesObj, display on map, bouncy marker
        
    }
}

// loop for each record in contacts max = 12

// ENTRY POINT>>>>>>>>

// Check if local Storage
    // check for file
        //load file
    //else 
        // scan contacts
        // save to ls
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var dudes = [];
//for (var i = 0; i<12; i++) {
//    dudes[i] = (new contact(i,"Tina"+i, [{"type" : "home", "value" : "345"}]));
//    dudes[i].makeDOMElement();
//}
//
//var superString = JSON.stringify(dudes);
//var dudes = new contact1();


localStorage.removeItem("contacts");

// Check if local storage supported 
if (localStorage) {

    // check for saved file
    if (localStorage.getItem("contacts")) {
        var dudes = [];
        var data = JSON.parse(localStorage.getItem("contacts"));
        for( var i = 0; i<12; i++) {
            dudes[i] = new contact1(data[i].id, data[i].name);
            var max = data[i].phone.length;
            if (data[i].phone){
                for(var cnt = 0; cnt<max; cnt++) {
                    dudes[i].phone =[{"type" : data[i].phone[cnt].type, "value" : data[i].phone[cnt].value}];
                }
            }
            dudes[i].makeDOMElement();
        }
        
       
//       for (var i = 0; i<12; i++) {
//            dudes[i] = (new contact1(i,"john", [{"type" : "home", "value" : "345"}]));
//            dudes[i].makeDOMElement();
//       }
        // load contacts from local storae 
        
    } else {
        alert('no contacts in local storage.... will scan contacts');
       
           var options = new ContactFindOptions();
            options.filter = '';
            options.multiple = true;
            var filter = ['displayName'];
            navigator.contacts.find(filter, success, err, options);

            function success(matches) {
                max = matches.length;
                alert(max);

               // if phone numbers are present
                if (matches[id].phoneNumbers.length > 0) {
                    var phone = document.createElement('p');
                  
                    

                    // loop through phone array
                    for (var i = 0; i < matches[id].phoneNumbers.length; i++) {
                        phoneNum.textContent = matches[id].phoneNumbers[i].type + ": " + matches[id].phoneNumbers[i].value;
                    }
                } 
            }

            function err() {
                var errMessage = document.createElement('p');
                errMessage.textContent = "Something went wrong... Not sure what.. Im new here";
                contactPage.appendChild(errMessage);
            }
    }
        // scan contacts and create new contact instances
        // save to local storage
        
}
    

//   localStorage.setItem("contacts", superString);
    
//} else {
//    alert("Local Storage is not supported.  Exercise will not work as required");
//}
