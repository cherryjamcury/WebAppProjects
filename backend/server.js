const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const express = require('express');
const app = express();
const firebase = require('./firebaseserver.js')
const ejs = require('ejs');
const hostname = '127.0.0.1';
const port = 3000;
app.set('view engine', 'ejs');
// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));


// let icons = {
//     'gs://userdbforproject.appspot.com/icons/alien.png': './icons/alien.png',
//     'gs://userdbforproject.appspot.com/icons/amanojaku.png': './icons/amanojaku.png',
//     'gs://userdbforproject.appspot.com/icons/anglerfish.png': './icons/anglerfish.png',
//     'gs://userdbforproject.appspot.com/icons/apache.png': './icons/apache.png',
//     'gs://userdbforproject.appspot.com/icons/athlete-2.png': './icons/athlete-2.png',
//     'gs://userdbforproject.appspot.com/icons/athlete.png': './icons/athlete.png',
//     'gs://userdbforproject.appspot.com/icons/avatar.png': './icons/avatar.png',
//     'gs://userdbforproject.appspot.com/icons/balloons.png': './icons/balloons.png',
//     'gs://userdbforproject.appspot.com/icons/batman.png': './icons/batman.png',
//     'gs://userdbforproject.appspot.com/icons/bear.png': './icons/bear.png',
//     'gs://userdbforproject.appspot.com/icons/bee.png': './icons/bee.png',
//     'gs://userdbforproject.appspot.com/icons/best-friend.png': './icons/best-friend.png',
//     'gs://userdbforproject.appspot.com/icons/burglar.png': './icons/burglar.png',
//     'gs://userdbforproject.appspot.com/icons/butterfly.png': './icons/butterfly.png',
//     'gs://userdbforproject.appspot.com/icons/cactus.png': './icons/cactus.png',
//     'gs://userdbforproject.appspot.com/icons/candle.png': './icons/candle.png',
//     'gs://userdbforproject.appspot.com/icons/chicken.png': './icons/chicken.png',
//     'gs://userdbforproject.appspot.com/icons/clam.png': './icons/clam.png',
//     'gs://userdbforproject.appspot.com/icons/clown.png': './icons/clown.png',
//     'gs://userdbforproject.appspot.com/icons/cow.png': './icons/cow.png',
//     'gs://userdbforproject.appspot.com/icons/cowboy.png': './icons/cowboy.png',
//     'gs://userdbforproject.appspot.com/icons/crocodile.png': './icons/crocodile.png',
//     'gs://userdbforproject.appspot.com/icons/crown.png': './icons/crown.png',
//     'gs://userdbforproject.appspot.com/icons/death.png': './icons/death.png',
//     'gs://userdbforproject.appspot.com/icons/delivery-boy.png': './icons/delivery-boy.png',
//     'gs://userdbforproject.appspot.com/icons/dentist.png': './icons/dentist.png',
//     'gs://userdbforproject.appspot.com/icons/devil-2.png': './icons/devil-2.png',
//     'gs://userdbforproject.appspot.com/icons/devil.png': './icons/devil.png',
//     'gs://userdbforproject.appspot.com/icons/dinosaur-2.png': './icons/dinosaur-2.png',
//     'gs://userdbforproject.appspot.com/icons/dinosaur.png': './icons/dinosaur.png',
//     'gs://userdbforproject.appspot.com/icons/dog-2.png': './icons/dog-2.png',
//     'gs://userdbforproject.appspot.com/icons/dog.png': './icons/dog.png',
//     'gs://userdbforproject.appspot.com/icons/donut.png': './icons/donut.png',
//     'gs://userdbforproject.appspot.com/icons/dove.png': './icons/dove.png',
//     'gs://userdbforproject.appspot.com/icons/dragon.png': './icons/dragon.png',
//     'gs://userdbforproject.appspot.com/icons/druid.png': './icons/druid.png',
//     'gs://userdbforproject.appspot.com/icons/duck.png': './icons/duck.png',
//     'gs://userdbforproject.appspot.com/icons/earthquake.png': './icons/earthquake.png',
//     'gs://userdbforproject.appspot.com/icons/elf-2.png': './icons/elf-2.png',
//     'gs://userdbforproject.appspot.com/icons/elf.png': './icons/elf.png',
//     'gs://userdbforproject.appspot.com/icons/fairy.png': './icons/fairy.png',
//     'gs://userdbforproject.appspot.com/icons/farmer.png': './icons/farmer.png',
//     'gs://userdbforproject.appspot.com/icons/firefighter.png': './icons/firefighter.png',
//     'gs://userdbforproject.appspot.com/icons/flower.png': './icons/flower.png',
//     'gs://userdbforproject.appspot.com/icons/frankestein.png': './icons/frankestein.png',
//     'gs://userdbforproject.appspot.com/icons/frog-.png': './icons/frog-.png',
//     'gs://userdbforproject.appspot.com/icons/frog.png': './icons/frog.png',
//     'gs://userdbforproject.appspot.com/icons/giraffe.png': './icons/giraffe.png',
//     'gs://userdbforproject.appspot.com/icons/girl.png': './icons/girl.png',
//     'gs://userdbforproject.appspot.com/icons/hippie.png': './icons/hippie.png',
//     'gs://userdbforproject.appspot.com/icons/hitotsume-kozo.png': './icons/hitotsume-kozo.png',
//     'gs://userdbforproject.appspot.com/icons/ice-cream.png': './icons/ice-cream.png',
//     'gs://userdbforproject.appspot.com/icons/juice.png': './icons/juice.png',
//     'gs://userdbforproject.appspot.com/icons/karaoke.png': './icons/karaoke.png',
//     'gs://userdbforproject.appspot.com/icons/kitty.png': './icons/kitty.png',
//     'gs://userdbforproject.appspot.com/icons/knight.png': './icons/knight.png',
//     'gs://userdbforproject.appspot.com/icons/lion.png': './icons/lion.png',
//     'gs://userdbforproject.appspot.com/icons/lollipop.png': './icons/lollipop.png',
//     'gs://userdbforproject.appspot.com/icons/magician.png': './icons/magician.png',
//     'gs://userdbforproject.appspot.com/icons/mask.png': './icons/mask.png',
//     'gs://userdbforproject.appspot.com/icons/meteor.png': './icons/meteor.png',
//     'gs://userdbforproject.appspot.com/icons/mime.png': './icons/mime.png',
//     'gs://userdbforproject.appspot.com/icons/monkey.png': './icons/monkey.png',
//     'gs://userdbforproject.appspot.com/icons/monster.png': './icons/monster.png',
//     'gs://userdbforproject.appspot.com/icons/mummy.png': './icons/mummy.png',
//     'gs://userdbforproject.appspot.com/icons/mutant-2.png': './icons/mutant-2.png',
//     'gs://userdbforproject.appspot.com/icons/mutant.png': './icons/mutant.png',
//     'gs://userdbforproject.appspot.com/icons/ninja.png': './icons/ninja.png',
//     'gs://userdbforproject.appspot.com/icons/officer.png': './icons/officer.png',
//     'gs://userdbforproject.appspot.com/icons/ogre.png': './icons/ogre.png',
//     'gs://userdbforproject.appspot.com/icons/orc.png': './icons/orc.png',
//     'gs://userdbforproject.appspot.com/icons/person.png': './icons/person.png',
//     'gs://userdbforproject.appspot.com/icons/pharaoh.png': './icons/pharaoh.png',
//     'gs://userdbforproject.appspot.com/icons/pig.png': './icons/pig.png',
//     'gs://userdbforproject.appspot.com/icons/pilot.png': './icons/pilot.png',
//     'gs://userdbforproject.appspot.com/icons/pirate.png': './icons/pirate.png',
//     'gs://userdbforproject.appspot.com/icons/princess.png': './icons/princess.png',
//     'gs://userdbforproject.appspot.com/icons/pumpkin.png': './icons/pumpkin.png',
//     'gs://userdbforproject.appspot.com/icons/rabbit.png': './icons/rabbit.png',
//     'gs://userdbforproject.appspot.com/icons/refugee.png': './icons/refugee.png',
//     'gs://userdbforproject.appspot.com/icons/robot.png': './icons/robot.png',
//     'gs://userdbforproject.appspot.com/icons/sailor.png': './icons/sailor.png',
//     'gs://userdbforproject.appspot.com/icons/sarugami.png': './icons/sarugami.png',
//     'gs://userdbforproject.appspot.com/icons/scientist.png': './icons/scientist.png',
//     'gs://userdbforproject.appspot.com/icons/scuba-diver.png': './icons/scuba-diver.png',
//     'gs://userdbforproject.appspot.com/icons/shark.png': './icons/shark.png',
//     'gs://userdbforproject.appspot.com/icons/shooting-star.png': './icons/shooting-star.png',
//     'gs://userdbforproject.appspot.com/icons/slug.png': './icons/slug.png',
//     'gs://userdbforproject.appspot.com/icons/snow-storm.png': './icons/snow-storm.png',
//     'gs://userdbforproject.appspot.com/icons/spider.png': './icons/spider.png',
//     'gs://userdbforproject.appspot.com/icons/superhero.png': './icons/superhero.png',
//     'gs://userdbforproject.appspot.com/icons/trusted-friends.png': './icons/trusted-friends.png',
//     'gs://userdbforproject.appspot.com/icons/unicorn-2.png': './icons/unicorn-2.png',
//     'gs://userdbforproject.appspot.com/icons/unicorn.png': './icons/unicorn.png',
//     'gs://userdbforproject.appspot.com/icons/vampire.png': './icons/vampire.png',
//     'gs://userdbforproject.appspot.com/icons/viking.png': './icons/viking.png',
//     'gs://userdbforproject.appspot.com/icons/werewolf.png': './icons/werewolf.png',
//     'gs://userdbforproject.appspot.com/icons/wolf.png': './icons/wolf.png',
//     'gs://userdbforproject.appspot.com/icons/woman.png': './icons/woman.png',
//     'gs://userdbforproject.appspot.com/icons/zebra.png': './icons/zebra.png'
//   }


firebase.listIcons()
.then((pathMapping) => {
  
    icons = pathMapping
    console.log(icons)
})
.catch((error) => {
  console.error('Error:', error);
});





app.get('/createProfile', (req, res) => {
    try {
        const htmlFilePath = path.join(__dirname, '../frontend/playerpageForm.html');
        const html = fs.readFileSync(htmlFilePath, 'utf8');
    
        const renderedHtml = ejs.render(html, { dictionary: icons });
    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(renderedHtml);
        res.end();
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found! ' + e.message);
    }
});




  















// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
    try {
        
        const htmlFilePath = path.join(__dirname, '../frontend/userForm.html');
        const html = fs.readFileSync(htmlFilePath, 'utf8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(html);
        res.end();
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found! ' + e.message);
    }
});



app.post('/signup-data', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end',  () => {
        const formData = JSON.parse(body);
        console.log('Received form data for sign up:', formData);

        if(formData['name']&&formData['email'] && formData['password']){
         const uid = firebase.firebaseSignUp(formData['name'], formData['email'], formData['password'])
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Data received successfully' }));
    });
});










// app.post('/signin-data', (req, res) => {
//     let body = '';

//     req.on('data', (chunk) => {
//         body += chunk;
//     });

//     req.on('end', () => {
//         const formData = JSON.parse(body); 
//         console.log('Received form data:', formData);
//         if(formData['email'] && formData['password']){
//             firebase.firebaseSignIn(formData['email'], formData['password'])
//         }
//         // You can now access formData.name, formData.email, and formData.password

//         // Handle the data as needed (e.g., save it to a database)
        
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify({ message: 'Data received successfully' }));
//     });
// });

app.post('/signin-data', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        const formData = JSON.parse(body); 
        console.log('Received form data:', formData);

        if (formData['email'] && formData['password']) {
            try {
                await firebase.firebaseSignIn(formData['email'], formData['password']);
                // Sign-in successful
            } catch (error) {
                console.error('Error during sign-in:', error);
                // Handle error (e.g., send an error response to the client)
            }
        }

        // Send a response back to the client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Data received successfully' }));
    });
});



const server = http.createServer(app);



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
