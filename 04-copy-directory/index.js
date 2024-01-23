const { exists, unlink } = require('fs');

const { mkdir, copyFile, readdir } = require('node:fs/promises');
const { join } = require('node:path');

const REFS = {
  originalPath: join(__dirname, 'files'),
  copyPath: join(__dirname, 'copy-files'),
};

const isExist = async (path) =>
  new Promise((res) => exists(path, (isExist) => res(isExist)));

const removeFiles = async (path) => {
  const entryFolder = await readdir(path, { withFileTypes: true });

  entryFolder.forEach(({ name }) => {
    const currentPath = join(path, name);
    unlink(currentPath, (err) => err && console.log(err));
  });
};

(async ({ originalPath, copyPath }) => {
  const _isExist = await isExist(copyPath);
  if (_isExist) {
    await removeFiles(copyPath);
  }

  if (!_isExist) await mkdir(copyPath);

  const filesList = await readdir(originalPath, { withFileTypes: true });

  filesList.forEach(({ name }) =>
    copyFile(join(originalPath, name), join(copyPath, name)),
  );
})(REFS);
