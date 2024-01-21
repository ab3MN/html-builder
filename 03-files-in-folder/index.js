const { promises, stat } = require('fs');
const path = require('path');
const { stdout } = require('node:process');

const getPath = (_path = '') => path.join(__dirname, `/${_path}`);

const getFilesList = async (dirName) => {
  let files = [];
  try {
    const items = await promises.readdir(dirName, { withFileTypes: true });
    for (const item of items) {
      const pathFile = path.join(dirName, item.name);

      if (!item.isDirectory()) {
        const { name, ext } = path.parse(pathFile);

        if (name && ext) {
          let fileInfo = name + ' - ' + ext.slice(1);

          stat(pathFile, (err, stats) => {
            try {
              const size = (stats.size / 1024).toFixed(3) + 'kb';
              stdout.write(fileInfo + ' - ' + size + '\n');
            } catch {
              return err.message;
            }
          });

          files.push(fileInfo);
        }
      } else {
        files = [...files, ...(await getFilesList(pathFile))];
      }
    }
  } catch (e) {
    console.log(e);
  }
  return files;
};

const folderPath = getPath('secret-folder');

getFilesList(folderPath);
