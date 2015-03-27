var contact1 = function(id, name){
    this.id = id;
    this.name = name;
    this.phone = "";
    this.lat = "";
    this.long = "";
    
    this.makeDOMElement = function() {
        var list = document.querySelector("#contact_list"),
            newContactDiv = document.createElement("div"),
            newContact = document.createElement("h2");

        newContactDiv.setAttribute('class', 'contact');
        newContactDiv.setAttribute('id', this.id);
        newContactDiv.addEventListener("click", displayContactInfo);
    //    newContactDiv.addEventListener("click", this.displayMap);
        newContact.setAttribute('class', 'name');
        newContactDiv.appendChild(newContact);
        list.appendChild(newContactDiv);
    }
    
    function displayContactInfo() {
        var dialog = document.querySelector('[data-role="dialog"]');
        dialog.setAttribute('class', 'dialogActive');
        var dialogMessage = document.querySelector("#dialogMessage");

        //this is pointing to newContactDiv!!!!  wrong
        alert(this.id);
        dialogMessage.innerHTML =  this.name+ " " + this.phone + "  " + this.id;
        var okBtn = document.querySelector("#btn");
        okBtn.addEventListener('click', function(){dialog.removeAttribute('class', 'dialogActive');});
        
    }
}

    
/*function makeDOMElement() {
        var list = document.querySelector("#contact_list"),
            newContactDiv = document.createElement("div"),
            newContact = document.createElement("h2");

        newContactDiv.setAttribute('class', 'contact');
        newContactDiv.setAttribute('id', this.id);
        newContactDiv.addEventListener("click", displayContactInfo);
    //    newContactDiv.addEventListener("click", this.displayMap);
        newContact.setAttribute('class', 'name');
        newContact.textContent = this.name;
        newContactDiv.appendChild(newContact);
        list.appendChild(newContactDiv);
    }*/
        
 /*function displayContactInfo() {

        var dialog = document.querySelector('[data-role="dialog"]');
        dialog.setAttribute('class', 'dialogActive');
        var dialogMessage = document.querySelector("#dialogMessage");

        //this is pointing to newContactDiv!!!!  wrong
        alert(this.id);
        dialogMessage.innerHTML = this.getName() + " " + this.phone + "  " + this.id;
        var okBtn = document.querySelector("#btn");
        okBtn.addEventListener('click', function(){dialog.removeAttribute('class', 'dialogActive');});
    }*/

function displayMap(userLat, userLong) {
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
            // load map centered on user coords.    need navigator.geolocation........
            //addEventListener for double tap. 
            //get coords, add to dudesObj, display on map, bouncy marker

        }
    }




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
                var dudes=[];
                max = matches.length;
                //constrain to 12 records
                if (max > 12) {
                    max = 12 ;
                }
                
                // loop through each contact record and create contact1 instance
                for (var cnt = 0; cnt<max; cnt++) {
                    dudes[cnt] = new contact1(cnt, matches[cnt].displayName);
                    
                    //phone number array
                    if (matches[cnt].phoneNumbers.length > 0) {
                        // loop through phone array
                        for (var i = 0; i < matches[cnt].phoneNumbers.length; i++) {
                            dudes[cnt].phone =[{"type" : matches[cnt].phoneNumbers[i].type, "value" : matches[cnt].phoneNumbers[i].value}];
                        }
                    } 
                    dudes[cnt].makeDOMElement();
                    dudes[cnt].makeDOMElement
                    
                  // ====>>   console.log(dudes[cnt]);
                }
               // if phone numbers are present
                
            }

            function err() {
                alert("somethin' went wrong");
            }
    }
        // scan contacts and create new contact instances
        // save to local storage
        
}