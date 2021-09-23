fetch('https://madhavasai-15.github.io/my/anime-list/0.json')
.then(res => res.json())
.then(firebaseConfig => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig['0']);

    // Update firestore settings
    firebase.firestore().settings({ timestampInSnapshots: true });

    // Checking localstorage for changes everyday
    var getDate = window.localStorage.getItem('MAL_D');
    var date = new Date().getDate();

    // Getting Animes from localStorage
    var Animes = JSON.parse(window.localStorage.getItem('MAL'));

    // Getting Anime Name from hash
    var hashAnime = window.location.hash.slice(1).replace(/%20/g, " ");
    var hashAnimeResults = [];

    // Animes from List
    var animes = [];

    // ReactJS
    class Result extends React.Component {
        constructor(){
            super();
            this.status = 'Not Added';
        }

        componentDidMount(){
            animes.map(anime => {
                if(this.props.anime.title.toLowerCase().replace(/[^a-zA-Z]/g, '') === anime.data.AnimeName.toLowerCase().replace(/[^a-zA-Z]/g, '')){
                    this.status = 'Added';
                }
            })
        }

        addToList = () => {
            if(this.status === 'Not Added'){
                Swal.fire({
                    imageUrl: this.props.anime.image_url,
                    imageWidth: 190,
                    imageHeight: 270,
                    text: `Click "add" to add ${this.props.anime.title} to your list`,
                    confirmButtonText: 'Add',
                    showCancelButton: true,
                }).then(result => {
                    if(result.isConfirmed){
                        firebase.auth().onAuthStateChanged(user => {
                            if(user){
                                firebase.firestore().collection('Users').doc(user.email).collection('List').add({
                                    AnimeName: this.props.anime.title,
                                    ImgUrl: this.props.anime.image_url,
                                    episodes: this.props.anime.episodes,
                                    watching: '0',
                                })
                                .then(() => {
                                    Swal.fire(`${this.props.anime.title} is added to your list!`);
                                    this.status = 'Added';
                                });
                            }
                        })
                    }
                })
            }else {
                Swal.fire({
                    text: `${this.props.anime.title} is already added to your list!`,
                });
            };
        }

        render(){
            let episodes = (this.props.anime.type == 'TV') ? <button> Episodes: {this.props.anime.episodes} </button> : <button> {this.props.anime.type} </button>;

            return (
                <div className="result">
                    <img className="image" src={this.props.anime.image_url} />
                    <div>
                        <h4 className="title" > <b> {this.props.anime.title} </b> </h4> 
                        <p className="synopsis"> {this.props.anime.synopsis} </p> 
                        <div className="details">
                            {episodes}
                            <button> Rated: {this.props.anime.rated} </button>
                            <button onClick={this.addToList}> Add </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    // Rendering Component
    class Web extends React.Component {
        constructor(){
            super();
            this.results = [];
        }

        search = () => {
            if($('#search-input').val() !== ''){
                window.location.hash = $('#search-input').val();
                ReactDOM.render(<Web/>, document.getElementById('main'));
            }
        }

        render(){
            hashAnimeResults.map(result => this.results.push(<Result anime={result} />));
                
            return (
                <div>
                    <header>
                        <h2> My Anime List </h2>
                        <ul className="topnav">
                            <li onClick={() => window.location.href = 'index.html'}><a> Home </a></li>
                            <li onClick={() => window.location.href = 'my-list.html'}><a> List </a></li>
                        </ul>
                    </header>
                    <div>
                        <input id="search-input" placeholder="Search Anime"/>
                        <button className="search-button" onClick={this.search}> Search </button>
                    </div>
                    <main>
                        <div className="results">
                            {this.results}
                        </div>
                    </main>
                </div>
            )
        }
    }

    // User
    firebase.auth().onAuthStateChanged(user => {
        if(user){
            if(getDate){
                animes = Animes;
            }else {
                firebase.firestore().collection('Users').doc(user.email).collection('List').orderBy('AnimeName').get()
                .then(snapshot => {
                    snapshot.docs.forEach(doc => animes.push({ id: doc.id, data: doc.data() }));
                })
                .then(() => window.localStorage.setItem('MAL', JSON.stringify(animes)));

                window.localStorage.setItem('MAL_D', new Date().getDate());
            }

            if(hashAnime){
                fetch(`https://api.jikan.moe/v3/search/anime?q=${hashAnime}`)
                .then(res => res.json())
                .then(anime => hashAnimeResults = anime.results)
                .then(() => ReactDOM.render(<Web/>, document.getElementById('main')))
                .catch(err => console.log(err));
            }
        }
    });

    window.addEventListener("hashchange", () => window.location.reload()); 
});