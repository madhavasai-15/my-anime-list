fetch('https://madhavasai-15.github.io/my/anime-list/0.json')
.then(res => res.json())
.then(firebaseConfig => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig['0']);

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
                        <button id="login-button" onClick={() => {
                            firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value)
                                .then(cred => {
                                    $('#error-message').html('');
                                })
                                .catch(err => {
                                    $('#error-message').html(err.message);
                                });
                        }}> Sign in </button>
                        <p id="error-message"></p>
                        <p id="having-account"> Don't have an account? <a href={'sign-up.html'}> Sign up </a> </p>
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