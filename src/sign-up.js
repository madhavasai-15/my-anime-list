fetch('https://madhavasai-15.github.io/my/anime-list/0.json')
.then(res => res.json())
.then(firebaseConfig => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig['0']);

    //update firestore settings
    firebase.firestore().settings({ timestampInSnapshots: true });

    // ReactJS
    class Web extends React.Component {
        render(){
            return (
                <div>
                    <header>
                        <h2> My Anime List </h2>
                    </header>
                    <main>
                        <input type="email" id="email" className="input" placeholder="Email" required />
                        <input type="password" id="password" className="input" placeholder="Password" required />
                        <button id="sign-up-button" onClick={() => {
                            firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#password').val())
                            .then(() => {
                                firebase.firestore().collection('Users').doc($('#email').val()).collection('List').doc('00000000000000000000').set({
                                    AnimeName: 'Add Anime',
                                    ImgUrl: 'Add_Anime.png',
                                    episodes: '0',
                                    watching: '0',
                                }).then(() => {
                                    window.location.href = 'index.html';
                                }) 
                                $('#error-message').html('');
                            })
                            .catch(err => {
                                $('#error-message').html(err.message);
                            });
                        }}> Sign up </button>
                        <p id="error-message"></p>
                        <p id="having-account"> Already have an account? <a href={'sign-in.html'}> Sign in </a> </p>
                    </main>               
                </div>
            )
        }
    }

    firebase.auth().onAuthStateChanged(user => {
        if(user){
        window.location.href = 'index.html';
        }else {
            ReactDOM.render(<Web/>, document.getElementById('main'));
        }
    });
});
