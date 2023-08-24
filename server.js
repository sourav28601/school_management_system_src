const http = require('http');
const app = require('./src/app');
require('dotenv').config();
const server = http.createServer(app);
const PORT = process.env.PORT || 8006;

server.listen(PORT, '127.0.0.1', () => console.log(`Server is working ${PORT}`));