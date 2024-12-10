import { readFile } from 'node:fs';

import {AMAZON_KEY} from './src/definitions.js'

const records = [];
const csvFile = process.argv[2];

if (csvFile) {
    readFile(csvFile, (err, data) => {
        if (err) ;
       console.log(data);
    });
} else {
    
    throw new Error('missing csv file');
}

console.log(AMAZON_KEY);



