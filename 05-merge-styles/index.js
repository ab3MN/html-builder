const { createReadStream, createWriteStream } = require('fs');
const { readdir } = require('node:fs/promises');
const { join, parse } = require('node:path');

const STYLES__FOLDER = join(__dirname, 'styles');
const BUNDLE__STYLE = join(__dirname, 'project-dist', 'bundle.css');

const writeableStream = createWriteStream(BUNDLE__STYLE);

(async () => {
  const filesList = await readdir(STYLES__FOLDER, { withFileTypes: true });

  filesList.forEach((file) => {
    const pathFile = join(STYLES__FOLDER, file.name);
    const { ext } = parse(pathFile);

    if (file.isFile() && ext === '.css') {
      const readableStream = createReadStream(pathFile);
      readableStream.pipe(writeableStream);
    }
  });
})();
