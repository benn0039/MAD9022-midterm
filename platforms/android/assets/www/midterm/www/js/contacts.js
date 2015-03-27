function getContact() {
                var contactPage = document.querySelector('#three');
                var options = new ContactFindOptions();
                options.filter = '';
                options.multiple = true;
                var filter = ['displayName'];
                
                // prevent contacts from aggregating on page after first visit
                if (hit) {
                    var delPerson = document.querySelector('.person');
                    contactPage.removeChild(delPerson);
                    hit = false;
                }

                navigator.contacts.find(filter, success, err, options);

                function success(matches) {
                    var newFrag = document.createDocumentFragment(),
                        min = 0,
                        max = matches.length - 1,
                        id = Math.round(Math.random() * (max - min) + min);
                 
                    var people = document.createElement('div');
                    people.setAttribute('class', 'person');

                    var name = document.createElement('p');
                    name.setAttribute('class', 'name');
                    name.textContent = "Name: " + matches[id].displayName;
                    people.appendChild(name);

                    var nick = document.createElement('p');
                    nick.setAttribute('class', 'nickname');
                    nick.textContent = "Nickname: " + matches[id].nickname;
                    people.appendChild(nick);

                   // if phone numbers are present
                        if (matches[id].phoneNumbers.length > 0) {
                            var phone = document.createElement('p');
                            phone.setAttribute('class', 'phone');

                            // loop through phone array
                            for (var i = 0; i < matches[id].phoneNumbers.length; i++) {
                                var phoneNum = document.createElement('p');
                                phoneNum.setAttribute('class', 'phoneNum');
                                phoneNum.textContent = matches[id].phoneNumbers[i].type + ": " + matches[id].phoneNumbers[i].value;
                                phone.appendChild(phoneNum);
                            }
                            people.appendChild(phone);
                        } 
                        newFrag.appendChild(people);
                        contactPage.appendChild(newFrag);
                    hit = true;
                }

                function err() {
                    var errMessage = document.createElement('p');
                    errMessage.textContent = "Something went wrong... Not sure what.. Im new here";
                    contactPage.appendChild(errMessage);
                }
            }