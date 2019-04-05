import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

firebase.initializeApp({
    apiKey: "AIzaSyBjVeqqdoYolqRIx9W4cM5PVgcnvjjqZ7Y",
    authDomain: "murointeractivo-ecc55.firebaseapp.com",
    databaseURL: "https://murointeractivo-ecc55.firebaseio.com",
    projectId: "murointeractivo-ecc55",
    storageBucket: "murointeractivo-ecc55.appspot.com",
    messagingSenderId: "1020134878544"
});



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

