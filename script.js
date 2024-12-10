import fs from 'fs';
import { parse } from "csv-parse";
import {staticVars} from './src/definitions.js';
import {getAmznBlob} from './src/amazon.js';


//start building each product with static var default values
const prodDeets = {
    name: "",
    slug: "",
    mainProductImage: "",
    pageHeaderImage: "",
    category: staticVars.category,
    collectionID: staticVars.collectionID,
    excludeFromMustHaveList: staticVars.excludeFromMustHaves.toString().toUpperCase(),
    enableRatings: staticVars.enableRatings.toString().toUpperCase(),
    shortProdDesc: "",
    longProdDesc: "",
    reviewHeadline: "",
    reviewSnippet: "",
    prosList: "",
    consList: "",
    reviewPageContent: "",
    partnerLink: "",
    partnerLinkLabel: staticVars.partnerLinkLabel,
    amznLink: "",
    photoGallery: ""
}

//parse the csv input
const records = [];
const csvFile = process.argv[2];

if (!csvFile) {
    throw new Error('missing csv file');
}


async function processRecords(records){
    for (const record of records){
        const csv_name = record[0];
        const csv_amznProdID = record[1];
        const csv_partnerLink = record[2];
        const amznBlob = await getAmznBlob(csv_amznProdID);
        console.log(amznBlob);
    }
}

fs.createReadStream(csvFile, (err) => {
    if (err) ;
    }).pipe(parse({ delimiter:",", from_line: 2 })
    .on("data", function(row){
        records.push(row);
    })
    .on("end", function(){
        processRecords(records);
       
    }))

// step 0: read csv (name, amznProdID, partnerLink)
// step 1: AmznAPI
// step 2: ClaudAPI
// step 3: Webflow create product




