import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_batgOH7acTvUOUIvBuvC2xSn0ET3tTI",
  authDomain: "seevee-63215.firebaseapp.com",
  projectId: "seevee-63215",
  storageBucket: "seevee-63215.appspot.com",
  messagingSenderId: "757571929613",
  appId: "1:757571929613:web:baf3eef66579b9fd433744",
  measurementId: "G-RXBB4F8CYT"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();
export default database;
