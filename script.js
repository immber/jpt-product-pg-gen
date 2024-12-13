import fs from 'fs';
import { parse } from "csv-parse";
import {staticVars} from './src/definitions.js';
import {getAmznBlob} from './src/amazon.js';
import {generateContent} from './src/anthropic.js'
import {makeWFitem} from './src/webflow.js';


//parse the csv input
const records = [];
const csvFile = process.argv[2];

if (!csvFile) {
    throw new Error('missing csv file');
}
    //function to assemble 'product' with staticVar default values & values from APIs
async function assembleProduct(record, amznBlob, contentBlob) {
    //first handle the imgVarients from amzon and build a photoGallery for webflow
    const imgList = amznBlob.imgVariants.map(elem => elem.Small.URL);
    const photoGallery = [];
    imgList.forEach(img => {
        photoGallery.push(
            {
                "url": img,
                "alt": null
            }
        )
    });
    //make an object to hold all the product deets
    const prodDeets = {
        name: record[0].trim(),
        slug: record[0].trim().toLowerCase().replaceAll(',',"").replaceAll(' ',"-"),
        mainProductImage: amznBlob.imgPrimary,
        pageHeaderImage: amznBlob.imgPrimary,
        category: staticVars.category,
        collectionID: staticVars.collectionID,
        excludeFromMustHaveList: staticVars.excludeFromMustHaves,
        enableRatings: staticVars.enableRatings,
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
        photoGallery: photoGallery //which was constructed above
    }
    return prodDeets;
    
}

async function processRecords(records){    
    for (const record of records){
        //using the amznProdID from the csv
        const amznBlob = await getAmznBlob(record[1]);
        console.log("Got prod deets from Amzn");
        const contentBlob = await generateContent(amznBlob.itemFeatures);
        console.log("Got copy from claude");
        const product = await assembleProduct(record, amznBlob, contentBlob);
        // console.log(product);
        const wfResponse = await makeWFitem(product);
        console.log(wfResponse);

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




