const { createReadStream, createWriteStream, exists } = require('fs');
const { readdir, mkdir, copyFile } = require('node:fs/promises');
const { join, parse, basename } = require('node:path');
const { promisify } = require('util');

/* ==================== REFS ==================== */
const REFS = {
  originalPath: join(__dirname, 'assets'),
  copyPath: join(__dirname, 'project-dist', 'assets'),
  stylesPath: join(__dirname, 'styles'),
  bundleCSSPath: join(__dirname, 'project-dist', 'style.css'),
  projectPath: join(__dirname, 'project-dist'),
  htmlTemplatePath: join(__dirname, 'template.html'),
  htmlComponentsPath: join(__dirname, 'components'),
};
/* ==================== HELPERS ==================== */
const readFile = async (filename) =>
  new Promise((resolve) =>
    createReadStream(filename, 'utf-8').on('data', (chunk) => resolve(chunk)),
  );

const _exists = promisify(exists);
const isExist = async (name) => await _exists(name, (isExist) => isExist);

/* ==================== GENERATE HTML ==================== */
const generateHtml = async (
  htmlTemplatePath,
  htmlComponentsPath,
  projectPath,
) => {
  try {
    let template = await readFile(htmlTemplatePath);

    const htmlList = await readdir(htmlComponentsPath, { withFileTypes: true });

    for (const html of htmlList) {
      const pathFile = join(htmlComponentsPath, html.name);
      const { ext } = parse(pathFile);

      if (html.isFile() && ext === '.html') {
        const content = await readFile(pathFile);
        const htmlName = basename(html.name, '.html');
        const regex = new RegExp(`{{${htmlName}}}`, 'g');

        template = template.replace(regex, content);
      }
    }
    const writeableStream = createWriteStream(join(projectPath, 'index.html'));
    writeableStream.write(template);
  } catch (e) {
    console.error(e);
  }
};

/* ==================== MAKE DIRECTORY ==================== */
const makeDirectory = async (projectPath) => {
  try {
    await mkdir(projectPath, { recursive: true });
  } catch (e) {
    console.error(e);
  }
};

/* ==================== MERGE STYLES ==================== */
const mergeStyles = async (stylesPath, bundleCSSPath) => {
  try {
    const writeableStream = createWriteStream(bundleCSSPath);

    const filesList = await readdir(stylesPath, { withFileTypes: true });

    filesList.forEach((file) => {
      const pathFile = join(stylesPath, file.name);
      const { ext } = parse(pathFile);

      if (file.isFile() && ext === '.css') {
        const readableStream = createReadStream(pathFile);
        readableStream.pipe(writeableStream);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

/* ==================== COPY FILES ==================== */
const copyFiles = async (originalPath, copyPath) => {
  try {
    const _isExist = await isExist(copyPath);

    if (!_isExist) await mkdir(copyPath);

    const filesList = await readdir(originalPath, { withFileTypes: true });

    filesList.forEach((el) => {
      const _originalPath = join(originalPath, el.name);
      const _copyPath = join(copyPath, el.name);

      return el.isDirectory()
        ? copyFiles(_originalPath, _copyPath)
        : copyFile(_originalPath, _copyPath);
    });
  } catch (e) {
    console.error(e);
  }
};

/* ==================== BUILD PROJECT DIST ==================== */
(async ({
  stylesPath,
  bundleCSSPath,
  originalPath,
  copyPath,
  projectPath,
  htmlTemplatePath,
  htmlComponentsPath,
}) => {
  try {
    await makeDirectory(projectPath);
    await copyFiles(originalPath, copyPath);
    await generateHtml(htmlTemplatePath, htmlComponentsPath, projectPath);
    await mergeStyles(stylesPath, bundleCSSPath);
  } catch (e) {
    console.error(e);
  }
})(REFS);
