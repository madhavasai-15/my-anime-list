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

var getAnime = getCookie('AD');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
var anime;
var animesDetails = [];
var User;

var changing;

firebase.auth().onAuthStateChanged(user => {
    if(user){
        User = user;
        setTimeout(() => {
            if (getAnime) {
                window.location.hash = getAnime;
            }
        }, 50);

        setTimeout(() => {
            let docList = [];
            firebase.firestore().collection('Users').doc(user.email).collection('List').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    docList.push(doc.data());
                    if (doc.id == getAnime) {
                        anime = doc.data();
                        fetch(`https://api.jikan.moe/v3/search/anime?q=${doc.data().AnimeName}`)
                        .then(res => res.json())
                        .then(anime => {
                            for (var i = 0; i < anime.results.length; i++){
                                animesDetails.push(anime.results[i]);
                                let episode = (anime.results[i].episodes == 0) ? doc.data().episodes : anime.results[i].episodes;
                                let watching;
                                if(i == 0){
                                    watching = `
                                    <button onclick="Click('watching')" id="watching"> watching: ${doc.data().watching} </button>
                                    <button onclick="Not_Users_Anime()" id="not-user-anime"> not your anime? </button>
                                    <div class="updating-container"></div>
                                    `;
                                }else {
                                    watching = `<button onclick="Add_Anime(${i})" id="add-button"> add </button>`;
                                }

                                for (var j = 0; j < docList.length; j++){
                                    if (i != 0) {
                                        if (anime.results[i].title.replace(/[^a-zA-Z]/g, '') == docList[j].AnimeName.replace(/[^a-zA-Z]/g, '')) {
                                            watching = `<button> added </button>`;
                                        }
                                    }
                                }
                                let type;
                                if(anime.results[i].type == 'Movie'){
                                    type = anime.results[i].type;
                                }else if(anime.results[i].type == 'OVA'){
                                    type = `${anime.results[i].type}: ${episode}`;
                                }else {
                                    type = `episodes: ${episode}`;
                                }
                                $(`
                                    <div class="result" id="result-${i}">
                                        <div class="container">
                                            <img class="image" src="${anime.results[i].image_url}">
                                            <h3 id="title"> ${anime.results[i].title} </h3>
                                            <p id="about"> ${anime.results[i].synopsis} </p>
                                            <button onclick="Click('episodes')" id="episodes"> ${type} </button>
                                            ${watching}
                                        </div>
                                    </div>
                                `).appendTo('.result-list');
                                if (i == anime.results.length - 1) {
                                    document.title = 'My Anime List';
                                }
                            }
                        });
                    }
                });
            })
            .catch(err => {
                console.warn(err.message);
            })
            $('.loader').hide();
        }, 100);
    }
});

function Add_Anime(index) {
    window.localStorage.setItem('AA', JSON.stringify({
        title: animesDetails[index].title,
        image_url: animesDetails[index].image_url,
        episodes: animesDetails[index].episodes,
    }));
    window.location.href = `uploading-new-anime.html#uploading-?${animesDetails[index].title}-anime`;
}

function Not_Users_Anime() {
    $(`
        <div class="only-anime-body" style="height= ">
            <div class="only-anime-container">
                <img class="image" src="${anime.ImgUrl}">
                <h3 id="title"> ${anime.AnimeName} </h3>
                <button onclick="Click('episodes')" id="episodes"> episodes: ${anime.episodes} </button>
                <button onclick="Click('watching')" id="watching"> watching: ${anime.watching} </button>
                <div class="updating-container"></div>
            </div>
        </div>
    `).appendTo('.only-anime');
    $('.result-list').empty();
};

function Click(change) {
    if(!changing){
        $(`
            <input id="input" ></input> 
            <button onclick="Update()" id="update-button"> update </button>
        `).appendTo('.updating-container');
        changing = change;
    } else {
        changing = null;
    }
}

function Update() {
    if(changing === 'watching'){
        firebase.firestore().collection('Users').doc(User.email).collection('List').doc(getAnime).update({
            watching: $('#input').val()
        }).then(() => {
            $('#input').remove();
            $('#update-button').remove();
            changing = null;
            window.location.reload();
        });
    }else if(changing === 'episodes'){
        firebase.firestore().collection('Users').doc(User.email).collection('List').doc(getAnime).update({
            episodes: $('#input').val()
        }).then(() => {
            $('#input').remove();
            $('#update-button').remove();
            changing = null;
            window.location.reload();
        });
    }
}
