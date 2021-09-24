fetch('https://madhavasai-15.github.io/my/anime-list/0.json')
.then(res => res.json())
.then(firebaseConfig => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig['0']);

    // Rendering Component
    class Web extends React.Component {
        render(){
            return (
                <div>
                    <header>
                        <h2> My Anime List </h2>
                        <ul className="topnav">
                            <li className="active" onClick={() => window.location.href = 'index.html'}><a> Home </a></li>
                            <li onClick={() => window.location.href = 'My-List.html'}><a> List </a></li>
                        </ul>
                    </header>
                    <main>
                    
                    </main>
                </div>
            )
        }
    }

    firebase.auth().onAuthStateChanged(user => {
        if(user){
            ReactDOM.render(<Web/>, document.getElementById('main'));
        }else {
            window.location.href = 'sign-in.html';
        }
    });
});
