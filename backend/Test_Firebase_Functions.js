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
        "nickname":"narcisia123",
        "icon":"http/gooogle/image/icon.png"};


(async () => {
    
    await db_registered_players.register(info1);
    await db_registered_players.register(info2);
    await db_registered_players.register(info3);
    // await db_player_page.invite(info1,info2);
    // await db_player_page.invite(info1,info3); 
    // await db_player_page.invite(info2,info1); 
    // await db_player_page.invite(info2,info3); 
    // await db_player_page.invite(info3,info2); 
    // await db_player_page.invite(info3,info1); 
    // await db_player_page.requests(info3.uid);

    // await db_player_page.handleRequests(info3.uid, info1.uid)
    })();
