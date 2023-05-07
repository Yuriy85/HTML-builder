const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);

stdout.write('Введите текс файла или exit: ');

stdin.on('data', data => {
  const text = data.toString().trim();

  if ([text].includes('exit')) {
    stdout.write('The End!');
    exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${text}`,
      err => {
        if (err) throw err;
      }
    );
    stdout.write('Введите текс файла или exit: ');
  }
});

process.on('SIGINT', () => {
  stdout.write('\nThe End!');
  exit();
});
