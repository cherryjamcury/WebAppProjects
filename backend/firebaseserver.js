const admin = require('firebase-admin');
const serviceAccount = require('./userdbforproject-firebase-adminsdk-kwqaw-50392c9ddd.json');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://userdbforproject-default-rtdb.firebaseio.com/',
  storageBucket: 'gs://userdbforproject.appspot.com'
});

const auth = admin.auth();
const db = admin.database();

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}



// function listIcons() {
//   const iconsURL = [];
//   ensureDirectoryExists('./icons');
//   const bucket = admin.storage().bucket();
//   const iconsFolder = 'icons';

//   bucket.getFiles({ prefix: iconsFolder }, (err, files) => {
//     if (err) {
//       console.error('Error listing items in icons folder:', err);
//       return;
//     }

//     files.forEach((file) => {
//       const localFilePath = `./icons/${path.basename(file.name)}`; // Extracts the file name
//       const fileStream = fs.createWriteStream(localFilePath);

//       bucket.file(file.name).createReadStream()
//         .on('error', (err) => {
//           console.error('Error downloading file:', err);
//         })
//         .on('end', () => {
//           console.log(`File ${file.name} downloaded to ${localFilePath}`);
//         })
//         .pipe(fileStream);

//       fileStream.on('finish', () => {
//         console.log(`File ${file.name} written successfully.`);
//         iconsURL.push(localFilePath);
//       });

//       fileStream.on('error', (err) => {
//         console.error(`Error writing file ${file.name}:`, err);
//       });
//     });
//   });
// }

async function listIcons() {
  const iconsURL = [];
  ensureDirectoryExists('./icons');
  const bucket = admin.storage().bucket();
  const iconsFolder = 'icons';

  return new Promise((resolve, reject) => {
    bucket.getFiles({ prefix: iconsFolder }, (err, files) => {
      if (err) {
        console.error('Error listing items in icons folder:', err);
        reject([]);
        return;
      }

      const promises = files.map((file) => {
        return new Promise((resolveFile) => {
          const localFilePath = `./icons/${path.basename(file.name)}`;
          const fileStream = fs.createWriteStream(localFilePath);

          bucket.file(file.name).createReadStream()
            .on('error', (err) => {
              console.error('Error downloading file:', err);
              resolveFile();
            })
            .on('end', () => {
              console.log(`File ${file.name} downloaded to ${localFilePath}`);
              resolveFile(localFilePath);
            })
            .pipe(fileStream);

          fileStream.on('finish', () => {
            console.log(`File ${file.name} written successfully.`);
          });

          fileStream.on('error', (err) => {
            console.error(`Error writing file ${file.name}:`, err);
          });
        });
      });

      Promise.all(promises)
        .then((urls) => {
          urls.forEach(url => {
            if (url.includes('.png')) {
              iconsURL.push(url.replace('./','../backend/'));
            }
          });
          // iconsURL.push(...urls);
          resolve(iconsURL);
        })
        .catch((err) => {
          console.error('Error while processing files:', err);
          reject([]);
        });
    });
  });
}











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








module.exports = {firebaseSignUp: firebaseSignUp, firebaseSignIn:firebaseSignIn, listIcons:listIcons}