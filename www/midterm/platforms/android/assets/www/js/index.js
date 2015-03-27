
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
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        getContacts();
        

            },

            // Update DOM on a Received Event
            receivedEvent: function(id) {

            }
    
   
};
app.initialize();

//localStorage.removeItem("contacts");
function getContacts() {
            if (localStorage) {
            alert("local storage");
            // check for saved file
            if (localStorage.getItem("contacts")) {
                var dudes = [];
                //data = localStorage.getItem("contacts");
               
                var data = JSON.parse(localStorage.getItem("contacts"));
                 //console.log(data);
                for( var i = 0; i<12; i++) {
                    dudes[i].id = data[i].id;
                    dudes[i].name = data[i].name;
                    var max = data[i].phone.length;
                    if (data[i].phone){
                        for(var cnt = 0; cnt<max; cnt++) {
                            dudes[i].phone =[{"type" : data[i].phone[cnt].type, "value" : data[i].phone[cnt].value}];
                            //console.log(dudes);
                        }
                    }
                }
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
                        alert("records: " + max);
                        //constrain to 12 records
                        if (max > 12) {
                            max = 12 ;
                        }
                        // loop through each contact record and create contact1 instance
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
                // scan contacts and create new contact instances
                // save to local storage

        }
}

    
