const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const express = require('express');
const app = express();
const {
    DB_registered_players,
    DB_player_page
} = require('./firebaseserver.js')


const ejs = require('ejs');
const hostname = '127.0.0.1';
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../frontend')));

const db_registered_players = new DB_registered_players();
const db_player_page = new DB_player_page();

let info1 =
    {
        "uid":"00001a",
        "name":"Harry Lyr",
        "email":"harry@gmail.com",
        "nickname":"harryPotter",
        "icon":"http/gooogle/image/icon.png"};

        let info2 =
        {
        "uid":"00002b",
        "name":"Finick Syrus",
        "email":"finick@gmail.com",
        "nickname":"finick1234",
        "icon":"http/gooogle/image/icon.png"};

        let info3 =
        {
        "uid":"00002c",
        "name":"Narcisia Lovegood",
        "email":"narcisia@gmail.com",
        "nickname":"finick1234",
        "icon":"http/gooogle/image/icon.png"};


(async () => {
    
    await db_registered_players.register(info1);
    await db_registered_players.register(info2);
    await db_registered_players.register(info3);
    await db_registered_players.register(info2); 
    // console.log(await db_registered_players.getStatus(info1.uid));
    // await db_registered_players.changeStatus(info1.uid,"busy");
    // console.log(await db_registered_players.getStatus("sdbvjsbskf"));
    // console.log(await db_registered_players.getStatus(info1.uid));
    // await db_registered_players.changeNickname(info1.uid, "HarryPotter");
    // await db_registered_players.validNickname("dd");
    // await db_registered_players.register("sdv324df","Mikosh Kosta","mikosh@gmail.com","mikosh123","www.ds.df.jpg")
    // await db_registered_players.register("958dfdfb","Anika Lapland","anika@gmail.com","anika123","www.ds.df.jpg");   
    // await db_registered_players.register("009324fd","Loopa Dua","loopa@gmail.com","loopa123","www.ds.df.jpg");  
    // await db_player_page.games("123ghsd3","tic_tac_toe")
    // await db_player_page.send_invite(sender={"uid":"123ghsd3","nickname":"luca123"}, receiver={"uid":"sdv324df","nickname":"mikosh123"});
    // //await db_player_page.send_invite(sender={"uid":"123ghsd3","nickname":"luca123"}, receiver={"uid":"sdv324","nickname":"mikosh123"});
    //await db_player_page.handel_request(sender={"uid":"123ghsd3","nickname":"luca123"}, receiver={"uid":"sdv324","nickname":"mikosh123"},"decline");
//     await db_player_page.handel_request(sender={"uid":"123ghsd3","nickname":"luca123"},receiver={"uid":"sdv324df","nickname":"mikosh123"}, "accept");
//     await db_player_page.send_invite(sender={"uid":"123ghsd3","nickname":"luca123"}, receiver={"uid":"958dfdfb","nickname":"anika123"});
//    // await db_player_page.send_invite(sender={"uid":"123ghsd3","nickname":"luca123"}, receiver={"uid":"sdv324","nickname":"mikosh123"});
})();
