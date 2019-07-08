'use strict';

const http = require('http');
const url = require('url');

const config = require('../config/serverconfig');
const simulator = require('./simulator');
const readStaticFile = require('./readStaticFile');

const server = http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        switch (request.method) {
            case 'POST': // data exchange with the client to simulate the game
                const data = JSON.parse(Buffer.concat(body).toString());
                response.writeHead(200, {'Content-type': 'application/json'});
                response.end(JSON.stringify(simulator(data)));
                break;
            case 'GET': // request static file
                const pathName = url.parse(request.url).pathname;
                const result = await readStaticFile(pathName);
                response.writeHead(result.statusCode, {'Content-type': result.mimeType});
                response.end(result.data);
                break;
            default:
                // status 501 seems more appropriate here, however it is prohibited for the missing HEAD method
                response.statusCode = 500;
                response.end();
        }
    })
});

server.listen(config.port, () => {
    console.log(`server is listening on http://localhost:${config.port}`);
});
