// backend/indexjs.js
const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;



const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        handleGetRequest(req, res);
    } else if (req.method === 'POST') {
        handlePostRequest(req, res);
    } else {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Method not allowed.');
    }
});




function handleGetRequest(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    
    try {
        const html = fs.readFileSync(__dirname + '/../frontend/index.html', 'utf8');
        res.write(html);
        res.end();
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found! ' + e.message);
    }
}



function handlePostRequest(req, res) {
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const formData = qs.parse(body);
        console.log('Received form data:', formData);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Data received successfully' }));
    });
}





server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});





// const server =http.createServer((req,res)=> {

//     res.status = 200;
//     res.setHeader('Contest-type','text/html');
//     try{
//         const html = fs.readFileSync('../frontend/index.html', 'utf8');
//         res.write(html);
//         res.end();
//     }
//     catch(e){
//         res.status = 404;
//         res.setHeader('Content-type', 'text/plain');
//         res.write('bad request!' + e);
//         res.end();
//     }
// });

// server.listen(port,  hostname, ()=>{
//     console.log(`Server running at http://${hostname}:${port}/`);
// })