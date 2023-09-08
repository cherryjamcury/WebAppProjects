const admin = require('firebase-admin');
const serviceAccount = require('./userdbforproject-firebase-adminsdk-kwqaw-50392c9ddd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://userdbforproject-default-rtdb.firebaseio.com/'
});

const auth = admin.auth();

async function myFunction(name, email, password) {
  try {
    const db = admin.database();
    const ref = db.ref('users');

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password
    });


    ref.push({
      userName: name,
      userEmail: email,
      gameName: {
        gameTitle: '',
        winNum: 0
      }
    }).then(() => {
      console.log('Data added successfully');
    })
    .catch((error) => {
      console.error('Error adding data:', error);
    });
    
    console.log('Successfully created new user:');
    return userRecord.uid;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}







module.exports = {myFunction: myFunction}