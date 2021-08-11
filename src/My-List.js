// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAGb1N4WGyUnJcJx1zxFP6YqPZ26MDHDys",
    authDomain: "my-anime-list-7b070.firebaseapp.com",
    projectId: "my-anime-list-7b070",
    storageBucket: "my-anime-list-7b070.appspot.com",
    messagingSenderId: "716138821740",
    appId: "1:716138821740:web:5efe5207f18c7feba8c049"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//update firestore settings
firebase.firestore().settings({ timestampInSnapshots: true });

firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log(user);
        firebase.firestore().collection('Users').doc(user.email).collection('List').orderBy('AnimeName').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                $(`
                    <div class="my-list-item">
                        <div class="container" onclick="window.location.href = '${doc.data().redirect}.html'; setCookie('AD', '${doc.id}', 1);">
                            <img id="item-img" class="image" src=${doc.data().ImgUrl}>
                            <div class="episodes">
                                <div class="text"> ${doc.data().watching} / ${doc.data().episodes}</div>
                            </div>
                            <span class="caption"> ${doc.data().AnimeName} </span>
                        </div>
                    </div>
                `).appendTo('.my-list');
            });
        });
        $('#profile-icon').css({ 'display': 'inline-block' });
    }else {
        $('#sign-in-button').html('Sign in');
        $('#sign-in-button').css({ 'display': 'inline-block' });
    }
});

//jquery
$(document).ready(function () {
    //searching anime from the list
    $("#search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        if (value === '$upload') {
            window.location.href = 'uploading-new-anime.html';
        } else {
            $('.my-list-item').filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            })
        }
    });

    //signing out the account
    $('#Sign-Out').click(function(){
        firebase.auth().signOut().then(() => {
            window.location.reload();
        });
    });
});
