const { copyFile, readdir, mkdir, readFile } = require('fs/promises');
const { join } = require('path');
const fs = require('fs');

// Копирование assets
const pathProject = join(__dirname, 'project-dist');
const pathOldFolder = join(__dirname, 'assets');
const pathNewFolder = join(__dirname, 'project-dist', 'assets');

async function copyDir(pathOldFolder, pathNewFolder) {
  await mkdir(pathProject, {recursive: true});
  await mkdir(pathNewFolder, {recursive: true});

  const oldFiles = await readdir(pathOldFolder, {withFileTypes: true});

  for (let iterator of oldFiles) {
    const nextOldFolder = join(pathOldFolder, iterator.name);
    const nextNewFolder = join(pathNewFolder, iterator.name);
    
    iterator.isFile() === true ? await copyFile(nextOldFolder, nextNewFolder) : await copyDir(nextOldFolder, nextNewFolder);
  }
}

copyDir(pathOldFolder, pathNewFolder);

// Создание index.html
const indexHtmlPath = join(pathProject, 'index.html');
const templateHtmlPath = join(__dirname, 'template.html');
const partsHtmlPath = join(__dirname, 'components');
const readIndexStream = fs.createReadStream(templateHtmlPath);
const writeIndexStream = fs.createWriteStream(indexHtmlPath);
const sample = new RegExp('{{(.*?)}}', 'g');

async function getParts() {
  const object = {};
  const filesArr = await readdir(partsHtmlPath);

  for (let index = 0; index < filesArr.length; index += 1) {
    object[filesArr[index].split('.')[0]] = String(await readFile(join(partsHtmlPath, `${filesArr[index].split('.')[0]}.html`)));
  }

  return object;
}

readIndexStream.on('data', async (value) => {
  let array = [];
  let dataString = String(value);
  const parts = await getParts();

  while (array !== null) {
    dataString = dataString.replace(`{{${array[1]}}}`, await parts[array[1]]);
    array = sample.exec(value);
  }

  writeIndexStream.write(dataString);
});

// Перенос стилей
const styleCss = join(__dirname, 'project-dist' , 'style.css');
const stylesFolder = join(__dirname, 'styles');
const filesArr = [];
const writeStream = fs.createWriteStream(styleCss);

fs.readdir(stylesFolder, {withFileTypes: true}, (error, fileOrFolder) => {
  if (error) throw error;

  for (const iterator of fileOrFolder) {
    if (iterator.isFile() === true) {
      if (/.css\b/.test(iterator.name) === true) {
        filesArr.push(iterator.name);
      }
    }
  }

  for (const iterator of filesArr) {
    fs.createReadStream(join(stylesFolder, iterator)).pipe(writeStream);
  }
});
