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

var selected_anime;
var LSanime = JSON.parse(window.localStorage.getItem('AA'));
var fakeLSAnime = false;

var User;
var docList = [];
firebase.auth().onAuthStateChanged(user => {
    if(user){
        User = user;
        firebase.firestore().collection('Users').doc(User.email).collection('List').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                docList.push(doc.data());
            })
        }).then(() => {
            $('#upload').css({ 'display': 'inline-block' });
            $('#select').css({ 'display': 'inline-block' });
            $('#name').css({ 'display': 'inline-block' });
            $('#total').css({ 'display': 'inline-block' });
            $('figure').css({ 'display': 'inline-block' });
        })
        
    }
});

setTimeout(() => {
    if (User) {
        if (LSanime) {
            if (window.location.hash !== `#uploading-?${LSanime.title}-anime`) {
                window.localStorage.removeItem('AA');
                window.location.reload();
            }
            document.getElementById('image').src = LSanime.image_url;
            document.getElementById('name').value = LSanime.title;
            document.getElementById('total').value = LSanime.episodes;

            $('#upload').click(function () {
                firebase.firestore().collection('Users').doc(User.email).collection('List').add({
                    AnimeName: $('#name').val(),
                    ImgUrl: LSanime.image_url,
                    episodes: $('#total').val(),
                    watching: '0',
                    redirect: 'anime',
                }).then(() => { $('#message').html(`You Have Uploaded The ${$('#name').val()} to Your List!`); })
            });

            $('#select').hide();
        } else {
            $('#select').click(function () {
                var input = document.createElement('input');
                input.type='file';
                input.onchange = e => {
                    files = e.target.files; reader = new FileReader(); reader.onload = function () {
                        document.getElementById('image').src = reader.result
                    };
                    reader.readAsDataURL(files[0]);
                }
                input.click();
            });
            
            $('#upload').click(function () {
                if (!fakeLSAnime) {
                    var upload = firebase.storage().ref(`Anime-Images/${$('#name').val()}.png`).put(files[0]);
                    upload.on('state_changed', function (snapshot) {
                        $('#message').html(`Uploading... in ${Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}%`);
                    },
                        function (error) {
                            alert(error);
                        },
                        function () {
                            upload.snapshot.ref.getDownloadURL().then(function (url) {
                                firebase.firestore().collection('Users').doc(User.email).collection('List').add({
                                    AnimeName: $('#name').val(),
                                    ImgUrl: url,
                                    episodes: $('#total').val(),
                                    watching: '0',
                                    redirect: 'anime',
                                }).then(() => { $('#message').html(`You Have Uploaded The ${$('#name').val()} to Your List!`); })
                            });
                        });
                }
                
                if (fakeLSAnime) {
                    firebase.firestore().collection('Users').doc(User.email).collection('List').add({
                        AnimeName: $('#name').val(),
                        ImgUrl: document.getElementById('image').src,
                        episodes: $('#total').val(),
                        watching: '0',
                        redirect: 'anime',
                    }).then(() => { $('#message').html(`You Have Uploaded The ${$('#name').val()} to Your List!`); })
                }
            });
        }
    }
}, 600);

var ImgName, ImgUrl;
var files = [];
var reader;

var Timer;

$('#name').keyup(function () {
    clearTimeout(Timer);
    Timer = setTimeout(() => {
        $('.search-result').empty();
        fetch(`https://api.jikan.moe/v3/search/anime?q=${$("#name").val()}`)
            .then(res => res.json())
            .then(anime => {
                for (var i = 0; i < 10; i++) {
                    let add_text = 'Add';
                    for (var j = 0; j < docList.length; j++) {                        
                        if (anime.results[i].title.replace(/[^a-zA-Z]/g, '') == docList[j].AnimeName.replace(/[^a-zA-Z]/g, '')) {
                            //console.log(anime.results[i].title.toLowerCase().replace(/[^a-zA-Z]/g, ''), docList[j].AnimeName.toLowerCase().replace(/[^a-zA-Z]/g, ''))
                            add_text = 'Added';
                        }
                    }
                    $(`
                        <div class="search-result-item" id="result-${i}">
                            <div class="container">
                                <img class="image" src="${anime.results[i].image_url}">
                                <h3 id="title"> ${anime.results[i].title} </h3>
                                <p id="about"> ${anime.results[i].synopsis} </p>
                                <button onclick="adding('${anime.results[i].title}', '${anime.results[i].image_url}', '${anime.results[i].episodes}')"> ${add_text} </button>
                            </div>
                        </div>
                    `).appendTo('.search-result');
                }
            })
            .catch(err => {
                console.warn(err);
            });
    }, 600);
});

function adding(title, image_url, episodes) {
    fakeLSAnime = true;
    document.getElementById('image').src = image_url;
    document.getElementById('name').value = title;
    document.getElementById('total').value = episodes;
    $('.search-result').empty();
}





