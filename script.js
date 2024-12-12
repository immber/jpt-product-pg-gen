import fs from 'fs';
import { parse } from "csv-parse";
import {staticVars} from './src/definitions.js';
import {getAmznBlob} from './src/amazon.js';
import {generateContent} from './src/anthropic.js'


//parse the csv input
const records = [];
const csvFile = process.argv[2];

if (!csvFile) {
    throw new Error('missing csv file');
}

async function assembleProduct(record, amznBlob, contentBlob) {
    //start building each product with static var default values
    const prodDeets = {
        name: record[0].trim(),
        slug: record[0].trim().toLowerCase().replaceAll(',',"").replaceAll(' ',"-"),
        mainProductImage: amznBlob.imgPrimary,
        pageHeaderImage: amznBlob.imgPrimary,
        category: staticVars.category,
        collectionID: staticVars.collectionID,
        excludeFromMustHaveList: staticVars.excludeFromMustHaves.toString().toUpperCase(),
        enableRatings: staticVars.enableRatings.toString().toUpperCase(),
        shortProdDesc: contentBlob.title,
        longProdDesc: amznBlob.itemTitle,
        reviewHeadline: contentBlob.reviewHeadline,
        reviewSnippet: contentBlob.shortDesc,
        prosList: contentBlob.prosList,
        consList: contentBlob.consList,
        reviewPageContent: contentBlob.content,
        partnerLink: record[2],
        partnerLinkLabel: staticVars.partnerLinkLabel,
        amznLink: amznBlob.amznLink,
        photoGallery: "" //will pull from amznBlob.imgVariants
    }
    return prodDeets;
    
}

async function processRecords(records){    
    for (const record of records){
        //using the amznProdID from the csv
        const amznBlob = await getAmznBlob(record[1]);
        // console.log(amznBlob);
        const contentBlob = await generateContent(amznBlob.itemFeatures);
        // console.log(contentBlob);
        const product = await assembleProduct(record, amznBlob, contentBlob);
        console.log(product);
        // const wfResponse = await makeWFitem(product);
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




