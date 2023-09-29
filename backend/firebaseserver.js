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
const bucket = admin.storage().bucket();
const iconsFolder = 'icons';

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    
  }

}


async function listIcons() {
  const pathMapping = {}; // Initialize mapping object
  


  ensureDirectoryExists('../frontend/icons')
  
  return new Promise((resolve, reject) => {
    bucket.getFiles({ prefix: iconsFolder }, (err, files) => {
      if (err) {
        console.error('Error listing items in icons folder:', err);
        reject([]);
        return;
      }

      const promises = files.map((file) => {
        return new Promise((resolveFile) => {
          const localFilePath = `../frontend/icons/${path.basename(file.name)}`;
          const fileStream = fs.createWriteStream(localFilePath);

          if (file.name.includes('.png')) {
                      
          pathMapping[`gs://${bucket.name}/${file.name}`] = localFilePath.replace('../frontend/','./');
          }
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
        .then(() => {
          resolve(pathMapping);
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




class DB_registered_players{
  
  constructor(){
    this.firebaseDB = db.ref();
    this.DBRef = this.firebaseDB.child('registred_players_db');
    this.db_player_page = new DB_player_page(); 
  }



  curTime(){
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  curDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }
  
  async  validNickname(nickname) {
    try {
        const snapshot = await this.DBRef.orderByChild('nickname').equalTo(nickname).once('value');
        if (snapshot.exists()) {
          return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(`Error checking nickname availability: ${error}`);
        return false;
    }
}

  async  register(info) {
    try {
        const newPlayer = this.DBRef.child(info.uid);
        const snapshot = await newPlayer.once('value');
        const registrData = snapshot.val();

        if (registrData === null) {
            const isNicknameValid = await this.validNickname(info.nickname);

            if (isNicknameValid) {
                const data = {
                    name: info.name,
                    email: info.email,
                    nickname: info.nickname,
                    status: "offline",
                    description: `${info.name}'s registration occurred on ${this.curDate()} at ${this.curTime()}`
                };

                await newPlayer.set(data);
                console.log(`${info.name} is registered on ${this.curDate()} at ${this.curTime()}\n`);
                
                await this.db_player_page.create(info);
                return true;
            } else {
                console.log(`${info.nickname} is already in use. Select another nickname to register\n`);
                return false;
            }
        } else {
            console.log(`${info.name} has already registered\n`);
            return false;
        }
    } catch (error) {
        console.error(`Error during registration: ${error}\n`);
        return false;
    }
}





    async changeStatus(playerUid="", newStatus=""){

      const status = ["offline", "online", "busy"];
      if(status.includes(newStatus)){
        try {
          const updateData = {};
          updateData[`${playerUid}/status`] = newStatus;
          await this.DBRef.update(updateData);
          console.log(`Status for ${await this.getNickname(playerUid)} is updated to ${newStatus}`);
          return true;
        } catch (error) {
          console.error('Error updating data:', error);
          return false;
        }
      }
      else{
        console.log("Invalid player status");
        return false;
      }
    }
    async getStatus(playerUid=""){
      const snapshot = await this.DBRef.child(`${playerUid}/status`).once('value');
      if(snapshot.exists()){
        return snapshot.val();
      }
      else{
        return "unknown"
      }
    }
    
    // async changeNickname(playerUid, newNickname){
    //   try {
    //     const updateData = {};
    //     updateData[`${playerUid}/nickname`] = newNickname;
    //       await this.DBRef.update(updateData);
    //       console.log(`Nickname for ${playerUid} is updated to ${newNickname}`);
    //       return true;
    //     } catch (error) {
    //       console.error('Error updating data:', error);
    //       return false;
    //     }
    //   }

    async getNickname(playerUid = ""){
      const snapshot = await this.DBRef.child(`${playerUid}/nickname`).once('value');
      if(snapshot.exists()){
        return snapshot.val();
      }
      else{
        return "unknown"
      }
    }

   



  }
 

  class DB_player_page{
    constructor(){
      this.firebaseDB = db.ref();
      this.DBRef = this.firebaseDB.child('player_page_db');
      this.played_games = {"tic_tac_toe":{"wins":0}, "battleship":{"wins":0},"tetris":{"wins":0}};
    }
    
    async create(info = {uid:"",name:"",email:"",nickname:"",icon:""}){
      const playerRef = this.DBRef.child(info.uid);
      try{
        await playerRef.set({
          info:{
            uid:info.uid,
            nickname:info.nickname,
            icon:info.icon
          },
          games: this.played_games,
          friends:"Empty",
          invitations:"Empty",
          requests:"Empty"
        });
        console.log(`Personal page for ${info.name} is created`);
      }
      catch(error){
        console.log(`Create perosnal page for ${info.name} Error: ${error}`);
      }
    }


    async games(uid, gameName) {
      try {
        const snapshot = await this.DBRef.child(`${uid}/played_games/${gameName}`).once('value');
        const gameData = snapshot.val();
    
        if (gameData !== null) {
          
          const wins = gameData.wins || 0;
          await this.DBRef.child(`${uid}/played_games/${gameName}`).update({ wins: wins + 1 });
          console.log(`Wins updated for game ${gameName}`);
          return true;
        } else {
          console.log(`Game ${gameName} is not registered.`);
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }


    async invite(sender={uid:"",name:"",email:"",nickname:"",icon:""}, receiver={uid:"",name:"",email:"",nickname:"",icon:""}){
      const senderRef = this.DBRef.child(`${sender.uid}`);
      const receiverRef = this.DBRef.child(`${receiver.uid}`);
      
      const friendsSnapshot = (await senderRef.child(`friends/${receiver.uid}`).once('value')).val();
      const invitationsSnapshot = (await senderRef.child(`invitations/${receiver.uid}`).once('value')).val();
      const requestsSnapshot = (await senderRef.child(`requests/${receiver.uid}`).once('value')).val();
    

      if(friendsSnapshot === null && invitationsSnapshot === null && requestsSnapshot == null){
      try {
        await receiverRef.child(`requests/${sender.uid}`).set({from: sender, message: `${sender.nickname} wants to be your friend!`});
        await senderRef.child(`invitations/${receiver.uid}`).set({to: receiver, message: `Friend request was sent to ${receiver.nickname}`});
        
        console.log(`Invitation is sent to ${receiver.nickname}`);
        return true;
      } catch(error) {
        console.log(`Error: Invitation is not sent - ${error}`);
        return false;
      }
    }
    else{
      if(friendsSnapshot){
        console.log(`${receiver.nickname} is already ${sender.nickname}'s friend`);
        return false;
      }
      else if(invitationsSnapshot){
        console.log(`Invitation from ${sender.nickname} to ${receiver.nickname} already exists`);
        return false;
      }
      else if(requestsSnapshot){
        console.log(`${sender.nickname} has a request from ${receiver.nickname}`);
        return false;
      }
    }
    }

    

    async  requests(uid = "") {
      const reqRRef = await this.DBRef.child(uid).once('value');
   
      if (reqRRef.exists()) {
         const requestsListSnapshot = reqRRef.child(`requests`);
         requestsListSnapshot.forEach( childSnapshot => {
            const childData = childSnapshot.val();
            console.log(childData);
         });
      }
   }
   
   
   async  handleRequests(uid, reqUid){
    try {
      const reqRef = await this.DBRef.child(`${uid}/requests/${reqUid}`).once('value');
      const friendRef = await this.DBRef.child(reqUid).once('value');
      
      if (reqRef.exists() && friendRef.exists()) {
        const aRef = this.DBRef.child(uid);
        const bRef = this.DBRef.child(reqUid);
        const myData = friendRef.val();
        const friendData = reqRef.val();
        
        if (friendData.from && myData.invitations && myData.invitations[uid] && myData.invitations[uid].to) {
          await Promise.all([
            aRef.child(`friends/${reqUid}`).set(friendData.from),
            aRef.child(`requests/${reqUid}`).remove(),

            bRef.child(`friends/${uid}`).set(myData.invitations[uid].to),
            bRef.child(`invitations/${uid}`).remove()
          ]);
          
          console.log("Friend request handled successfully!");
          return true;
        }else {
           console.log("Error: 'from' or 'to' data is missing or undefined.");
           return false;
          }
        }
        else {
          console.log("Error: Request or friend not found.");
          return false;
        }
      } catch (error) {
        console.error("Error handling friend request:", error);
        return false;
      }
    }











}



 




module.exports = {
  firebaseSignUp: firebaseSignUp,
  firebaseSignIn:firebaseSignIn,
  listIcons:listIcons,
  DB_registered_players:DB_registered_players,
  DB_player_page:DB_player_page

}

