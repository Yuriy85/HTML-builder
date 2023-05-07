const path = require('path');
const fs = require('fs');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, {withFileTypes: true}, (error, fileOrFolder) => {
  if (error) throw error;

  for (const iterator of fileOrFolder) {
    if (iterator.isFile() === true) {
      const extension = iterator.name.slice(iterator.name.indexOf('.') + 1);
      const name = iterator.name.slice(0, iterator.name.indexOf('.'));
      const pathToFile = path.join(secretFolderPath, iterator.name);
      
      fs.stat(pathToFile, (error, file) => {
        if (error) throw error;
        console.log(`${name} - ${extension} - ${file.size} байт`);
      });
    }
  }
});
