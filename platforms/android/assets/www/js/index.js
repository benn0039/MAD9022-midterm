var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', back, false)
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        main();
    },
   
    receivedEvent: function(id) {
    }
};

var dudes=[];
app.initialize();

/////////////////////////////////////////////////////////////////////////
//
//  ENTRY POINT

function main() 
{
    getContacts();
}

//////////////////////////////////////////////////////////////////////////
//
//  CONTACT CLASS

function Person(id, name) 
{
    this.id = id;
    this.name = name;
    this.phone = [];
    this.lat = "";
    this.longi = "";
    this.setCoords = function(latitude, longitude) 
    {
        this.lat = latitude;
        this.longi = longitude;
        setData();
    }
    
    // build DOM Elements 
    this.makeDOMElement = function(id, name)  
    {
        var list = document.querySelector("#contact_list"),
            newContactDiv = document.createElement("div"),
            newContact = document.createElement("h2");

        newContactDiv.setAttribute('class', 'contact');
        newContactDiv.setAttribute('id', id);
        newContact.setAttribute('class', 'name');
        newContact.setAttribute('id', id);
        newContact.textContent = name;
        newContactDiv.appendChild(newContact);
        list.appendChild(newContactDiv);

        // Hammer js listeners.....
        var hammer = new Hammer(newContactDiv, {}),
            singleTap = new Hammer.Tap({ event: 'tap' }),
            doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
        hammer.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);
         
        hammer.on('doubletap', displayMap);
        hammer.on('tap', displayContactInfo);
        
        var hammer1 = new Hammer(newContact, {}),
            singleTap = new Hammer.Tap({ event: 'tap' }),
            doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
        hammer1.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);
         
        hammer1.on('doubletap', displayMap);
        hammer1.on('tap', displayContactInfo);
        
        
    }
}

// END CONTACT CLASS
//
///////////////////////////////////////////////////////////////////////////

function setData() {
    var data = JSON.stringify(dudes);
    localStorage.setItem("contacts", data);
    console.log(data);
}

function back() {
   var mapPage = document.querySelector('#map'),
        contactPage = document.querySelector('#contact_list'),
        back  = document.getElementById('back');
        mapPage.style.display = "none";
        back.style.display = "none";
        contactPage.style.display = 'block';
}

function displayMap(ev) {
    var mapPage = document.querySelector('#map'),
        contactPage = document.querySelector('#contact_list'), 
        id = ev.target.getAttribute('id'),
        back  = document.getElementById('back'),
        doubleTapFlag = null;
    
    back.addEventListener('click', function() {
        mapPage.style.display = "none";
        back.style.display = "none";
        contactPage.style.display = 'block';
    });
    
    // if no lat and long data for contact 
    if(!dudes[id].lat && !dudes[id].longi) {
        displayDoubleTap(dudes[id].name);
    } else {
        mapPage.style.display = "block";
        back.style.display = "inline";
        contactPage.style.display = 'none'; 
        doubleTapFlag = 1;
        hasGeo();
    }
    
     function hasGeo() {
        if (navigator.geolocation) {
            params = { enableHighAccuracy: true, timeout: 3600, maximumAge: 0 };
            navigator.geolocation.getCurrentPosition(getMap, gpsError, params);
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
    
    function getMap(position) {
        var location = position.coords,
            mapCentre = new google.maps.LatLng(location.latitude,location.longitude),
            mapOptions ={
            center:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            zoom:14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById("map_content"), mapOptions),
            
            // centre marker
            marker = new google.maps.Marker({
	        position: mapCentre,
	        animation: google.maps.Animation.DROP,
	        title: "TITLE"
            });
        
        marker.setMap(map);
        
        if (doubleTapFlag == 0)
        {
            var clicker = google.maps.event.addListener(map, 'dblclick', function( event ){
                var lt = event.latLng.lat(), lg = event.latLng.lng();
                dudes[id].setCoords(lt, lg);
                alert("GPS Coordinates have been set for " + dudes[id].name);
                google.maps.event.removeListener(clicker);
             
                contactCoords = new google.maps.LatLng(lt, lg);
                contactMarker = new google.maps.Marker({
                position: contactCoords,
                animation: google.maps.Animation.BOUNCE,
                title: "TITLE"
                });        
                contactMarker.setMap(map);
                });
        } 
        else 
        {
            var lt = dudes[id].lat, lg = dudes[id].longi;
            contactCoords = new google.maps.LatLng(dudes[id].lat, dudes[id].longi);
            contactMarker = new google.maps.Marker({
	        position: contactCoords,
	        animation: google.maps.Animation.BOUNCE,
	        title: dudes[id].name
            });        
            contactMarker.setMap(map);
        }
    }
    
    function displayDoubleTap(name) {
        var dialog = document.querySelector('[data-role="dialog"]'),
            dialogMessage = document.querySelector("#dialogMessage"),
            okBtn = document.querySelector("#btn");
        dialogMessage.innerHTML = "Please double-tap on the map to set the location coordinates for " + name;
        dialog.setAttribute('class', 'dialogActive');
        okBtn.addEventListener('click', closeDialog);
    
        function closeDialog() {
            dialog.removeAttribute('class', 'dialogActive');
            okBtn.removeEventListener('click', closeDialog);
            mapPage.style.display = "block";
            back.style.display = "inline";
            contactPage.style.display = 'none';
            doubleTapFlag = 0;
            hasGeo();
        }
    }
}

function displayContactInfo(ev) {
        var dialog = document.querySelector('[data-role="dialog"]'),
            dialogMessage = document.querySelector("#dialogMessage"),
            okBtn = document.querySelector("#btn"),
            recordId = ev.target.getAttribute('id'),
            phoneString;
        dialog.setAttribute('class', 'dialogActive');
        okBtn.addEventListener('click', closeDialog);
    
        function closeDialog() {
            dialog.removeAttribute('class', 'dialogActive');
            okBtn.removeEventListener('click', closeDialog);
        }
        phoneString = "<h3>" + dudes[recordId].name + "</h3><br>";
    
        // are there phone records?
        if (dudes[recordId].phone)
        {   
            for(var i=0; i<dudes[recordId].phone.length; i++)
            {
                phoneString += dudes[recordId].phone[i].type + ":  " + dudes[recordId].phone[i].value + "<br>";
            }
            dialogMessage.innerHTML = phoneString;
        }
    }

function getContacts() {
    if (localStorage) {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['displayName'];
        navigator.contacts.find(filter, success, err, options);

        function success(matches) {
            max = matches.length;
            if (max > 12) {
                max = 12 ;
            }
            // loop through each contact record and create array
            for (var cnt = 0; cnt<max; cnt++) {
                dudes[cnt] = new Person(cnt, matches[cnt].displayName);
                var ubound = matches[cnt].phoneNumbers.length;
                //phone number array
                if (matches[cnt].phoneNumbers.length > 0) {
                    // loop through phone array
                    for (var i = 0; i < ubound; i++) {
                        dudes[cnt].phone[i] ={"type" : matches[cnt].phoneNumbers[i].type, "value" : matches[cnt].phoneNumbers[i].value};
                        
                    }
                } 
                dudes[cnt].makeDOMElement(cnt, matches[cnt].displayName);
            }
            // tried without {}
            if (!localStorage.getItem("contacts"))
                setData();
        }

        function err() {
            alert("somethin' went wrong with locationing");
        }
    }
}
