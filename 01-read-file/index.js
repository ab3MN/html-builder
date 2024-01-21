const fs = require('fs');
const { join } = require('node:path');

const readableStream = fs.createReadStream(join(__dirname, '/text.txt'));

readableStream.on('data', (chunk) => console.log(chunk.toString()));
