import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDc23qZU0cC78VfLPU0lF4hZGkm2ytN5Cc",
    authDomain: "pourpainting-code.firebaseapp.com",
    databaseURL: "https://pourpainting-code.firebaseio.com",
    projectId: "pourpainting-code",
    storageBucket: "pourpainting-code.appspot.com",
    messagingSenderId: "360195404520",
    appId: "1:360195404520:web:5a475987e0799d09568f5d",
    measurementId: "G-7PZZ65PTBD"
});

const db = firebaseApp.firestore();

const storage = firebase.storage().ref();

export { db, storage };