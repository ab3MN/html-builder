const { exists } = require('fs');
const { mkdir, copyFile, readdir } = require('node:fs/promises');
const { promisify } = require('util');
const { join } = require('node:path');

const _exists = promisify(exists);

const ORIGINAL__NAME = join(__dirname, 'files');
const COPY__NAME = join(__dirname, 'copy-files');

const isExist = async (name) => await _exists(name, (isExist) => isExist);

(async () => {
  const _isExist = await isExist(COPY__NAME);

  if (!_isExist) await mkdir(COPY__NAME);

  const filesList = await readdir(ORIGINAL__NAME, { withFileTypes: true });

  filesList.forEach(({ name }) =>
    copyFile(join(ORIGINAL__NAME, name), join(COPY__NAME, name)),
  );
})();
