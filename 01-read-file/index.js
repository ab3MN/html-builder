const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '/text.txt');

const readableStream = fs.createReadStream(dirPath);

readableStream.on('data', (chunk) => console.log(chunk.toString()));
