const admin = require('firebase-admin');
const serviceAccount = require('./userdbforproject-firebase-adminsdk-kwqaw-50392c9ddd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://userdbforproject-default-rtdb.firebaseio.com/'
});

const auth = admin.auth();
const db = admin.database();

async function firebaseSignUp(name, email, password) {
  try {
   
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });
    const ref = db.ref('users').child(userRecord.uid);
    await ref.set({
      userName: name,
      userEmail: email,
      gameName: {
        gameTitle: '',
        winNum: 0
      }
    });

    console.log('User created and data saved successfully:', userRecord.uid);
  } catch (error) {
    console.error('Error:', error.message);
  }
}


async function firebaseSignIn(email, password) {
  try {
    const db = admin.database();
    const ref = db.ref('users');
    const user = await auth.getUserByEmail(email);
    console.log('User Found:', user.displayName);
    
    ref.child(user.uid).once('value', (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        console.log('User Data:', userData);
        console.log('User Name:', userData.userName);
      } else {
        console.log('User Data is null or empty');
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}







module.exports = {firebaseSignUp: firebaseSignUp, firebaseSignIn:firebaseSignIn}