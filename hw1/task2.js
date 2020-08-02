import csv from 'csvtojson';
import { pipeline } from 'stream';
import { existsSync, mkdirSync, createWriteStream } from 'fs';

(function task2() {
  const filePath = './csv/file.csv';
  const resDir = './txt';
  if (!existsSync(resDir)){
    mkdirSync(resDir);
  }

  csv({
    delimiter: '\t',
    headers: ['book', 'author', 'amount', 'price'],
    ignoreColumns: /amount/,
  })
    .fromFile(filePath)
    .on('error', (err) => {
      console.error(`Reading .csv file was failed. ${err}`);
    })
    .then((jsonObj) => {
      const jsonStr = JSON
        .stringify(jsonObj)
        .replace(/\[|\]/g, '')
        .replace(/},|}/g, '}\n');

      pipeline(
        jsonStr,
        createWriteStream('./txt/file.txt'),
        (err) => {
          if (err) {
            console.error('Writing to .txt file was failed.', err);
          } else {
            console.log('Text file was successfully created and written.');
          }
        }
      );
    })
})();