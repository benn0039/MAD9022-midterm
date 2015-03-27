
var app = {
    // Application Constructor
   // people: [],
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is theevent. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        getContacts();
        

    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();

//localStorage.removeItem("contacts");
function getContacts() {
    if (localStorage) {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['displayName'];
        navigator.contacts.find(filter, success, err, options);

        function success(matches) {
            var dudes=[];
            max = matches.length;
            alert("records: " + max);
            //constrain to 12 records
            if (max > 12) {
                max = 12 ;
            }
            // loop through each contact record and create array
            for (var cnt = 0; cnt<max; cnt++) {
                dudes[cnt].id = cnt;
                dudes[cnt].name = maches[cnt].displayName;
                //phone number array
                if (matches[cnt].phoneNumbers.length > 0) {
                    // loop through phone array
                    for (var i = 0; i < matches[cnt].phoneNumbers.length; i++) {
                        dudes[cnt].phone =[{"type" : matches[cnt].phoneNumbers[i].type, "value" : matches[cnt].phoneNumbers[i].value}];
                        //console.log(dudes[cnt]);
                    }
                } 
            }
            var superString = JSON.stringify(dudes);
            //console.log(superString);
            localStorage.setItem("contacts", superString);
        }

        function err() {
            alert("somethin' went wrong");
        }
    }
}

function makeDOMElement()  {
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

    
