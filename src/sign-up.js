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

$('#sign-in-button').click(function () {
    firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#password').val())
    .then(() => {
        firebase.firestore().collection('Users').doc($('#email').val()).collection('List').doc('00000000000000000000').set({
            AnimeName: 'Add Anime',
            ImgUrl: 'Add_Anime.png',
            episodes: '0',
            watching: '0',
            redirect: 'uploading-new-anime',
        }).then(() => {
            window.location.href = 'index.html';
        }) 
        $('#error-message').html('');
    })
    .catch(err => {
        $('#error-message').html(err.message);
    });
});