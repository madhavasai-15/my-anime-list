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

firebase.auth().onAuthStateChanged(user => {
    if(user){
       console.log(user);
       $('#profile-icon').css({ 'display': 'inline-block' });
    }else {
        $('#sign-in-button').html('Sign in');
        $('#sign-in-button').css({ 'display': 'inline-block' });
    }
});

$('#Sign-Out').click(function(){
    firebase.auth().signOut().then(() => {
        window.location.reload();
    });
});