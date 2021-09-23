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

    // Type Hash
    var type = window.location.hash.slice(1);

    //anime array for faster loading animes to list
    var animes = [];

    // Anime Elements
    class Anime extends React.Component {
        // Deleting Anime Element from List and Also in Database
        delete = () => {
            Swal.fire({
                title: 'Do you want to delete ' + this.props.anime.data.AnimeName,
                imageUrl: this.props.anime.data.ImgUrl,
                imageWidth: 190,
                imageHeight: 270,
                showDenyButton: true,
                confirmButtonText: 'Delete',
                denyButtonText: `Cancel`,
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.auth().onAuthStateChanged(user => {
                        firebase.firestore().collection('Users').doc(user.email).collection('List').doc(this.props.anime.id).delete();
                        $(`#${this.props.anime.id}`).remove();
                    });
                }
            })
        }

        // Updating the episodes adn watching numbers of Anime
        update = () => {
            Swal.fire({
                imageUrl: this.props.anime.data.ImgUrl,
                imageWidth: 190,
                imageHeight: 270,
                text: this.props.anime.data.AnimeName,
                input: 'text',
                inputLabel: 'Watching',
                inputValue: this.props.anime.data.watching,
                confirmButtonText: 'Update',
                showDenyButton: true,
                denyButtonText: 'Update Episodes',
            }).then((watching) => {
                // Checking if watching should be changed or change episodes
                if(watching.isConfirmed){
                    // Checking if the watching should be changed and if it is a number or not
                    if(!Number.isNaN(watching.value)){
                        // If watching input is more than anime episodes then watching = episodes
                        if(watching.value > this.props.anime.data.episodes){
                        watching.value = this.props.anime.data.episodes; 
                        }

                        // Updating the local storage
                        // To avoid firebase firestore 50k reads per day 
                        let animes_ = Animes;
                        animes_.map(anime_ => {
                            if(anime_.id == this.props.anime.id){
                                anime_.data.watching = watching.value;
                                window.localStorage.setItem('MAL', JSON.stringify(animes_));
                            }
                        });                 

                        // Updating component watching to value to have same number in input when
                        // user want to change it again
                        this.props.anime.data.watching = watching.value;

                        // If user is signed in
                        firebase.auth().onAuthStateChanged(user => {
                            // Updating 
                            firebase.firestore().collection('Users').doc(user.email).collection('List').doc(this.props.anime.id).update({
                                watching: watching.value,
                            })
                            .then(() => {
                                // If these conditions meets with watching value
                                // the element will be display: none;
                                if(type){
                                    if(type == 'not-started' || type == 'started'){
                                        if(watching.value == this.props.anime.data.episodes){
                                            $(`#${this.props.anime.id}`).hide();
                                        }
                                    }else if(type == 'completed'){
                                        if(watching.value == 0){
                                            $(`#${this.props.anime.id}`).hide();
                                        }
                                    }
                                }
                                
                            })
                            // Changing the value instead of reload
                            $(`#${this.props.anime.id} .text #1`).html(`${watching.value}`);
                        });
                    }
                }else if(watching.isDenied){
                    Swal.fire({
                        imageUrl: this.props.anime.data.ImgUrl,
                        imageWidth: 190,
                        imageHeight: 270,
                        text: this.props.anime.data.AnimeName,
                        input: 'text',
                        inputLabel: 'Episodes',
                        inputValue: this.props.anime.data.episodes,
                        confirmButtonText: 'Update',
                    }).then((episodes) => {
                        if(episodes.isConfirmed){
                            if(!Number.isNaN(episodes)){
                                let animes_ = Animes;
                                animes_.map(anime_ => {
                                    if(anime_.id == this.props.anime.id){
                                        anime_.data.episodes = episodes.value;
                                        window.localStorage.setItem('MAL', JSON.stringify(animes_));
                                    }
                                });

                                this.props.anime.data.episodes = episodes.value;

                                firebase.auth().onAuthStateChanged(user => {
                                    firebase.firestore().collection('Users').doc(user.email).collection('List').doc(this.props.anime.id).update({
                                        episodes: episodes.value,
                                    })
                                    $(`#${this.props.anime.id} .text #2`).html(`${episodes.value}`);
                                });
                            }
                        }
                    })
                }
            })
        }

        render(){
            if(this.props.anime.id !== '00000000000000000000'){
                // Loading the component based on type 
                let display = (type) ? (type == 'all' ? 'flex' : (type == 'not-started' ? (this.props.anime.data.watching == 0 ? 'flex' : 'none') : (type == 'started' ? (this.props.anime.data.watching < this.props.anime.data.episodes && this.props.anime.data.watching > 0 ? 'flex' : 'none') : (type == 'completed' ? (this.props.anime.data.watching == this.props.anime.data.episodes && this.props.anime.data.episodes != 0 ? 'flex' : 'none') : 'none')))): 'flex';

                return (
                    <anime className="list-item" style={{display}} id={this.props.anime.id}>
                        <div className="container">
                                <img id="item-img" className="image" src={this.props.anime.data.ImgUrl}/>
                            <button className="delete" onClick={this.delete}> <div> X </div> </button>
                            <button className="update" onClick={this.update}> Update </button>
                            <div className="episodes">
                                <div className="text"> <span id="1"> {this.props.anime.data.watching} </span> / <span id="2"> {this.props.anime.data.episodes} </span> </div>
                            </div>
                            <span className="title"> {this.props.anime.data.AnimeName} </span>
                        </div>
                    </anime>
                )
            }else {
                return (
                    <addanime className="list-item" id={this.props.anime.id}>
                        <div className="container">
                                <img id="item-img" className="image" src={this.props.anime.data.ImgUrl}/>
                            <button className="update" onClick={() => {
                                Swal.fire({
                                    text: 'Type The Anime Name',
                                    input: 'text',                                    
                                })
                                .then(result => {
                                    window.location.href = `uploading-new-anime.html#${result.value}`;
                                })
                            }}> Add </button>
                            <span className="title"> Add Anime </span>
                        </div>
                    </addanime>
                )
            }
        }
    }

    // Rendering Component
    class Web extends React.Component {
        constructor(){
            super();
            this.listItems = [];
        }

        render(){
            animes.map(anime => this.listItems.push(<Anime anime={anime}/>));

            return (
                <div>
                    <header>
                        <h2> My Anime List </h2>
                        <ul className="topnav">
                            <li className="nav" onClick={() => window.location.href = 'index.html'}> Home </li>
                            <li className="nav active" onClick={() => window.location.href = 'my-list.html'}>List </li>
                            <select className="select-type" id="type" onChange={() => {
                                window.location.hash = document.getElementById('type').value; 
                                window.location.reload();
                            }}>
                                <option value="select"> Type </option>
                                <option value="all"> All </option>
                                <option value="not-started"> Not Started </option>
                                <option value="started"> Started </option>
                                <option value="completed"> Completed </option>
                            </select>  
                            <li className="sign-in" style={{'display': 'none'}}> Sign In </li>
                        </ul>
                        <input id="search-input" type="text"/>
                        <button id="search-input-button" onClick={() => {
                            var value = $('#search-input').val().toLowerCase();
                            $('.list-item').filter(function () {
                                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                            });
                        }}><i className="fa fa-search"></i></button>
                    </header>
                    <main>
                        <section className="list">
                            {this.listItems}
                        </section>
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
                ReactDOM.render(<Web/>, document.getElementById('main'));
            }else {
                firebase.firestore().collection('Users').doc(user.email).collection('List').orderBy('AnimeName').get()
                .then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        animes.push({
                            id: doc.id,
                            data: doc.data(),
                        });
                        
                    })
                })
                .then(() => {
                    window.localStorage.setItem('MAL', JSON.stringify(animes));
                    ReactDOM.render(<Web/>, document.getElementById('main'));
                })

                window.localStorage.setItem('MAL_D', new Date().getDate());
            }
        }
    });

    addEventListener("keyup", (event) => {
        if(event.key == 'Enter'){
            var value = $('#search-input').val().toLowerCase();
            $('.list-item').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        }
    }) 
});