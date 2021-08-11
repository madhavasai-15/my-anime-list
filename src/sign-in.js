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
        window.location.href = 'index.html';
    }
});

$('#login-button').click(function () {
    firebase.auth().signInWithEmailAndPassword($('#email').val(), $('#password').val())
    .then(cred => {
        console.log(cred);
        $('#error-message').html('');
    })
    .catch(err => {
        $('#error-message').html(err.message);
        console.warn(err.message);
    });
});