const { createWriteStream, createReadStream, readdir } = require('fs');
const { join } = require('path');

const bundleCss = join(__dirname, 'project-dist' , 'bundle.css');
const stylesFolder = join(__dirname, 'styles');
const filesArr = [];
const writeStream = createWriteStream(bundleCss);

readdir(stylesFolder, {withFileTypes: true}, (error, fileOrFolder) => {
  if (error) throw error;

  for (const iterator of fileOrFolder) {
    if (iterator.isFile() === true) {
      if (/.css\b/.test(iterator.name) === true) {
        filesArr.push(iterator.name);
      }
    }
  }

  for (const iterator of filesArr) {
    createReadStream(join(stylesFolder, iterator)).pipe(writeStream);
  }
});
