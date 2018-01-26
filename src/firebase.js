import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBvBaCN1y4klYAtCCeB6zvUAm4pxUR44aE",
    authDomain: "workoutapp-c49bb.firebaseapp.com",
    databaseURL: "https://workoutapp-c49bb.firebaseio.com",
    projectId: "workoutapp-c49bb",
    storageBucket: "workoutapp-c49bb.appspot.com",
    messagingSenderId: "588388264497"
  };
firebase.initializeApp(config);
export default firebase;
