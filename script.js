import fs from 'fs';
import { parse } from "csv-parse";

import {AMAZON_KEY} from './src/definitions.js'

const records = [];
const csvFile = process.argv[2];

if (!csvFile) {
    throw new Error('missing csv file');
}

fs.createReadStream(csvFile, (err) => {
    if (err) ;
    }).pipe(parse({ delimiter:",", from_line: 2 })
    .on("data", function(row){
        records.push(row);
    })
    .on("end", function(){
        console.log(records);
    }))

    
console.log(AMAZON_KEY);





