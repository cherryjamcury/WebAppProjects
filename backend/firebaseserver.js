import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

const firebaseConfig = {

    apiKey: "AIzaSyDHTVLYqtS7JYDDTV-LBsUu0xQWIXMCf_I",
  authDomain: "signupnewuser-4df0f.firebaseapp.com",
  databaseURL: "https://signupnewuser-4df0f-default-rtdb.firebaseio.com",
  projectId: "signupnewuser-4df0f",
  storageBucket: "signupnewuser-4df0f.appspot.com",
  messagingSenderId: "181396793104",
  appId: "1:181396793104:web:b77fab0d79005deb16a795",
  measurementId: "G-RCRM59FMHB"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  export { auth, createUserWithEmailAndPassword }; // Export the functions or objects you want to use in server.js