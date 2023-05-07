const { copyFile, readdir, mkdir, unlink } = require('fs/promises');
const { join } = require('path');

const pathOldFolder = join(__dirname, 'files');
const pathNewFolder = join(__dirname, 'files-copy');

async function copyDir() {
  await mkdir(pathNewFolder, {recursive: true});

  const oldFiles = await readdir(pathOldFolder);
  const newFiles = await readdir(pathNewFolder);

  newFiles.forEach(async file => {
    if (oldFiles.indexOf(file) === -1) {
      await unlink(join(pathNewFolder, file));
    }
  });

  oldFiles.forEach(async file => {
    await copyFile(join(pathOldFolder, file), join(pathNewFolder, file));
  });
}

copyDir();
