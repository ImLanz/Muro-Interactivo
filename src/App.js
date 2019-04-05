import React, { Component } from 'react';
//import logo from './logo.svg';
import firebase from 'firebase';
import './App.css';
import FileUpload from './FileUpload';

class App extends Component {

  constructor() {

    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

    componentWillMount() {

      firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
      });

      firebase.database().ref('pictures').on('child_added', snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });

    }

    handleAuth(){
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email}Has iniciado sesion!`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));

    }

    handleUpload(event) {
      const file = event.target.files[0];
      const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
      const task = storageRef.put(file);

      task.on('state_changed', snapshot => {
          let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.setState({
              uploadValue: percentage
          })
      }, error => {
          console.log(error.message)
        }, () =>  storageRef.getDownloadURL().then(url =>  {
          const record = {
            photoURL: this.state.user.photoURL,
            displayName: this.state.user.displayName,
            image: url
          };
          const dbRef = firebase.database().ref('pictures');
          const newPicture = dbRef.push();
          newPicture.set(record);
      }));
    }
    

    handleLogOut(){
      firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} Has cerrado sesion`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    renderLoginButton(){
      //Si el usuario esta loguado 
      if(this.state.user){
        return(
          <div className ="cuenta">
            <h2>Tu Perfil:</h2>
            <img className= "LaFoto" width="150" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
            <p>Hola { this.state.user.displayName } !</p>
            
            <p>¿Publicamos?</p>
            
            <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue} />
            <button onClick={this.handleLogOut}>Cerrar sesion</button>
          </div>

        );
      }else{
      //Si no lo esta
      return(
      <button onClick={this.handleAuth}>Inicia con Google</button>
      );
      }
    }

  
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Muro Interactivo</h2>
        </header>
        <div className = "Intro">
         <h3>Comparte, explora y diviertete!</h3>
        </div>
        <div className="publicaciones">

          <div className="botonInicio">

            <p>
              {this.renderLoginButton()}
            </p>

          </div>

          <h2>
            Publicaciones:
          </h2>
          
        </div>
        <div className = "Contenido">
        <div className = "Publicaciones">
  
            {
              this.state.pictures.map(picture => (
                <div className="App-card">
                  <figure className="App-card-image">
                    
                      <div className="card-imagen">
                        <img width="720" src={picture.image} />
                      </div>

                    <figCaption className="perfilcaption">
                      <div className="card-usuario-image">

                        <img width="50" className="perfilfoto" src={picture.photoURL} alt={picture.displayName} />

                      </div>
                      <div className="card-usuario-nombre">
                      <span className="perfilnombre">↑ Post by {picture.displayName} ↑</span>
                      </div>
                    </figCaption>
                  </figure>
                </div>
              )).reverse()
          }

        </div>
        </div>
      </div>
    );
  }

  

}

export default App;
