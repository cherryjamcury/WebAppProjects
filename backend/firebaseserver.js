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
  
  async register(info = {uid:"",name:"",email:"",nickname:"",icon:""}){
    const newPlayer = this.DBRef.child(info.uid);
    const snapshot = await newPlayer.once('value');
    const registrData = snapshot.val();
    
    if(registrData === null){
      if(await this.validNickname(info.nickname)){
        try{
          let data = {
            name: info.name,
            email: info.email,
            nickname: info.nickname,
            status: "offline",
            description:`${info.name}'s registration occurred on ${this.curDate()} at ${this.curTime()}`
          };
          await newPlayer.set(data);
          console.log(`${info.name} is registred on ${this.curDate()} at ${this.curTime()}`);
          await this.db_player_page.create(info);
          return true;
        }catch(error){
          console.log(`${error} occured`);
          return false;
        }
      }
      else{
        console.log(`${info.nickname} is already in use. select other nickname to register`);
        return false;
      }
    }
    else{
      console.log(`${info.name} has already registered`);
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

    async validNickname(nickname=""){
      try{
        const snapshot = await this.DBRef.once('value');
        const data = snapshot.val();
        for (let i in data){
          if(data[i].nickname === nickname){
            console.log(`this nickname ${nickname} is used`);
            return false;
          }
        }
        console.log(`this nickname ${nickname} can be used`);
        return true;
      }catch(error){
        console.log(`error rised: ${error}`);
        return false;
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
          played_games: this.played_games,
          player_friends:"Empty",
          sent_invitation:"Empty",
          received_invitation:"Empty"
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





    async send_invite(sender={uid:"",nickname:""}, receiver={uid:"",nickname:""}){



      
      const receiverRef = this.DBRef.child(`${receiver.uid}/received_invitation`);
      const senderRef = this.DBRef.child(`${sender.uid}/sent_invitation`);
      const frienListSnapshot = (await this.DBRef.child(`${sender.uid}/player_friends/${receiver.uid}`).once('value')).val();
      const sentInvitationSnapshot = (await this.DBRef.child(`${sender.uid}/sent_invitation/${receiver.uid}`).once('value')).val();
      const receivedInvitationSnapshot = (await this.DBRef.child(`${sender.uid}/received_invitation/${receiver.uid}`).once('value')).val();
      
      
      if(frienListSnapshot === null && sentInvitationSnapshot == null && receivedInvitationSnapshot=== null){
        try{
          await receiverRef.set({
            [sender.uid]:{ sender, status: "waiting", message: `${sender.nickname} wants to be your friend!`}
          });
          
          await senderRef.set({
            [receiver.uid]:{receiver,status:"waitind", message:`frined request was sent to ${receiver.nickname}`}
          });
          return true;
        }catch(error){
          return false;
        }
      }

      else{
        console.log(`${receiver.nickname} is already in friendlist or ivitation is already sent`)
        return false;
      }
    
    }


    async handel_request(sender={uid:"",nickname:""}, receiver={uid:"",nickname:""}, status="reject"){
      const  receiverMsg = (await this.DBRef.child(`${receiver.uid}/received_invitation/${sender.uid}`).once("value")).val();
      const senderMsg =    (await this.DBRef.child(`${sender.uid}/sent_invitation/${receiver.uid}`).once("value")).val();
      
      if(receiverMsg && senderMsg){
        const receiverRef = this.DBRef.child(`${receiver.uid}/received_invitation`);
        const senderRef = this.DBRef.child(`${sender.uid}/sent_invitation`);
        const receiverFriendRef = this.DBRef.child(`${receiver.uid}/player_friends`);
        const senderFriendRef = this.DBRef.child(`${sender.uid}/player_friends`);
        console.log('OK')

        if(status === "accept")
        {
          try{
            await receiverFriendRef.set({[sender.uid]:sender});
          }catch(e){
          }
          try{
            await senderFriendRef.set({[receiver.uid]:receiver});
          }catch(e){
          }
        }
            receiverRef.child(sender.uid).remove().then(() => {console.log('Entry  removed successfully.');
          }).catch((error) => {
            console.error('Error removing entry:', error);});
            
            senderRef.child(receiver.uid).remove().then(() => {console.log('Entry removed successfully.');
          }).catch((error) => {
            console.error('Error removing entry:', error);});
            
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

