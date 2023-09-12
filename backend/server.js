const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const express = require('express');
const app = express();
const firebase = require('./firebaseserver.js')

const hostname = '127.0.0.1';
const port = 3000;

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

firebase.listIcons()
  .then((iconsURL) => {
    console.log('Icons URLs:', iconsURL);
  })
  .catch((err) => {
    console.error('Error:', err);
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
