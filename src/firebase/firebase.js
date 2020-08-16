import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAbz550V53_xd5sAinpiaUPMz7lmZzUxP0",
    authDomain: "bytegram-b01b5.firebaseapp.com",
    databaseURL: "https://bytegram-b01b5.firebaseio.com",
    projectId: "bytegram-b01b5",
    storageBucket: "bytegram-b01b5.appspot.com",
    messagingSenderId: "644389804460",
    appId: "1:644389804460:web:fe7d4e8773425442954209"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}