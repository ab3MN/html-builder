const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin, stdout, exit } = require('node:process');

const r1 = readline.createInterface({ input: stdin, output: stdout });

const writeableStream = fs.createWriteStream(path.join(__dirname, '/text.txt'));

stdout.write('Write the text: \n');

r1.on('line', (text) => writeableStream.write(`${text} \n`));

process.on('exit', () => stdout.end('End of writing the text'));
process.on('SIGINT', () => (r1.close(), exit()));
