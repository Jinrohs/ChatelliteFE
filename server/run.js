'use strict';

const http = require('http');
const app = require('./app');
const server = http.createServer(app);

server.listen(4444, () => {
    if (process && process.send) {
        process.send('server listening.');
    }
});
