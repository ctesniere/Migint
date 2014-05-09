// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Initialise la table des infos des utilisateurs
    populateTable();

    // Ajout de l'evenement pour le click
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#userInfo').on('click', 'a.linkdeleteuser', deleteUser);

    var alert = document.getElementsByClassName('alert');
    for (var i = 0; i < alert.length; ++i) {
        console.log(alert[i].innerText);
        if (alert[i].innerText)
            alert[i].style.display = "block";
    };
//
//    $('body').find('.error').each(function(idx, item) {
//        if (/^\s*$/.test(item.text())){
//            item.css({
//                display : 'block'
//            })
//         }
//    });

});

// Functions =============================================================

// Remplie la table des users
function populateTable() {
    var tableContent = '';
    $.getJSON( '/users/list', function( data ) {
        userListData = data;
        console.log(data);
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '</tr>';
        });
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoUserName').text(thisUserObject.username);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    var builderAction = "";
    if (true) { // use cookie
        builderAction += '<a href="#" class="linkdeleteuser" rel="' + thisUserObject._id + '">Delete</a>';
        builderAction += ' | ';
        builderAction += '<a href="/users/edit/' + thisUserObject._id + '">Edit</a></td>';
        builderAction += ' | ';
        builderAction += '<a href="/chat?username=' + thisUserObject.username + '">Chat !</a>';
        builderAction += '<br><br>';
    }
    $('#actionUser').html(builderAction);


    var builderMessage = "";
    if (thisUserObject.message != null && thisUserObject.message.length > 0) {
        for (var i = 0; i < thisUserObject.message.length; ++i) {
            builderMessage += '<div>' + thisUserObject.message[i] + '</div>';
        }
    }
    $('#messageUser').html(builderMessage);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#addUser fieldset input').val('');
                    $('#msgDanger').removeClass("visible");
                    $('#msgSuccess').text("Confirmation: Nouvel utilisateur enregistré !").addClass("visible");;

                }
                else {

                    // If something goes wrong, alert the error message that our service returned
                    $('#msgDanger').text('Error: ' + response.msg).addClass("visible");;
                }
            });
    } else {
        $('#msgDanger').text('Renseigner tous les champs').addClass("visible");;
        return false;
    }
};


// Add User
function edit(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#addUser fieldset input').val('');
                    $('#msgDanger').removeClass("visible");
                    $('#msgSuccess').text("Confirmation: Nouvel utilisateur enregistré !").addClass("visible");;
                }
                else {

                    // If something goes wrong, alert the error message that our service returned
                    $('#msgDanger').text('Error: ' + response.msg).addClass("visible");;
                }
            });
    } else {
        $('#msgDanger').text('Renseigner tous les champs').addClass("visible");;
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this user?');

    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

                if (response.msg === '') {
                    $('#userInfoUserName').text("-");
                    $('#userInfoEmail').text("-");
                    $('#userInfoName').text("-");
                    $('#userInfoAge').text("-");
                    $('#userInfoGender').text("-");
                    $('#userInfoLocation').text("-");
                    $('#actionUser').text("");
                } else {
                    alert('Error: ' + response.msg);
                }

                // Update the table
                populateTable();
            });

    }
    else {
        return false;
    }

};
