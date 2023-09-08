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
        const formData = JSON.parse(body); // Parse JSON data
        console.log('Received form data:', formData);

        if(formData['email'] && formData['password']){
         const uid = firebase.myFunction(formData['name'], formData['email'], formData['password'])
        // You can now access formData.name, formData.email, and formData.password
        }
        // Handle the data as needed (e.g., save it to a database)
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Data received successfully' }));
    });
});
app.post('/signin-data', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const formData = JSON.parse(body); // Parse JSON data
        console.log('Received form data:', formData);

        // You can now access formData.name, formData.email, and formData.password

        // Handle the data as needed (e.g., save it to a database)
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Data received successfully' }));
    });
});


const server = http.createServer(app);



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
