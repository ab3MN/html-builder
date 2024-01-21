const { exists, promises } = require('fs');
const { mkdir, copyFile } = require('node:fs/promises');
const { promisify } = require('util');
const { join } = require('node:path');

const _exists = promisify(exists);

const getFilesList = async (dirName) => {
  let files = [];

  try {
    const items = await promises.readdir(dirName, { withFileTypes: true });
    for (const item of items) {
      const pathFile = join(dirName, item.name);

      item.isDirectory()
        ? (files = [...files, ...(await getFilesList(pathFile))])
        : files.push(item.name);
    }
  } catch (e) {
    console.log(e);
  }
  return files;
};

const ORIGINAL__NAME = join(__dirname, 'files');
const COPY__NAME = join(__dirname, 'copy-files');

async function isExist(name) {
  const _isExist = await _exists(name, (isExist) => isExist);
  return _isExist;
}

async function copyDirectory() {
  const _isExist = await isExist(COPY__NAME);

  if (!_isExist) await mkdir(COPY__NAME);

  const filesList = await getFilesList(ORIGINAL__NAME);

  filesList.forEach((file) => {
    const originalName = join(ORIGINAL__NAME, file);
    const copyName = join(COPY__NAME, file);

    copyFile(originalName, copyName);
  });
}

copyDirectory();
