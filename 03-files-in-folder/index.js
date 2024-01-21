const { promises, stat } = require('fs');
const path = require('path');
const { stdout } = require('node:process');

const { promisify } = require('util');

const _stat = promisify(stat);

const getFilesList = async (dirName) => {
  let files = [];
  try {
    const items = await promises.readdir(dirName, { withFileTypes: true });
    for (const item of items) {
      const pathFile = path.join(dirName, item.name);

      if (item.isDirectory()) {
        files = [...files, ...(await getFilesList(pathFile))];
      } else {
        const { name, ext } = path.parse(pathFile);

        if (name && ext) {
          const stats = await _stat(pathFile);
          const size = (stats.size / 1024).toFixed(3) + 'kb';

          files.push(name + ' - ' + ext.slice(1) + ' - ' + size);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  return files;
};

getFilesList(path.join(__dirname, '/secret-folder'))
  .then((files) => files.forEach((file) => stdout.write(file + '\n')))
  .catch((e) => console.log(e));
