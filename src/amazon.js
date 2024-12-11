import { AMAZON_KEY,
    AMAZON_SECRET,
    AMAZON_PARTNER_TAG } from './definitions.js';

import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk';


export async function getAmznBlob(amznProdID) {
    //define the API client & instantiate a getItemsRequest
    let defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
    defaultClient.accessKey = AMAZON_KEY;
    defaultClient.secretKey = AMAZON_SECRET;
    /**
     * PAAPI Host and Region to which you want to send request.
     * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
     */
    defaultClient.host = 'webservices.amazon.com';
    defaultClient.region = 'us-east-1';
        
    const api = new ProductAdvertisingAPIv1.DefaultApi();
   
    let getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();
    getItemsRequest['PartnerTag'] = AMAZON_PARTNER_TAG;
    getItemsRequest['PartnerType'] = 'Associates';
    getItemsRequest['ItemIds'] = [amznProdID];
    //getItemsRequest['ItemIds']  = ['B002MAPN62']; //static ID used in dev testing
    getItemsRequest['Condition'] = 'New';
    /**
     * Choose resources you want from GetItemsResource enum
     * For more details, refer: https://webservices.amazon.com/paapi5/documentation/get-items.html#resources-parameter
     */
    getItemsRequest['Resources'] = [
        'Images.Primary.Medium',
        'Images.Variants.Small', 
        'ItemInfo.Title', 
        'ItemInfo.Features'
    ];
   
    //handle successful requests and parse the response
    function onSuccess(data){
        let getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
        if (getItemsResponse['ItemsResult'] !== undefined) {
            let responseList = getItemsResponse['ItemsResult']['Items'];
            //define an object to return the api response, should match 'Resources' + amznLink
            let amznBlob = {
                amznLink: responseList[0].DetailPageURL,
                imgPrimary: responseList[0].Images.Primary.Medium.URL,
                imgVariants: responseList[0].Images.Variants,
                itemFeatures: responseList[0].ItemInfo.Features.DisplayValues,
                itemTitle: responseList[0].ItemInfo.Title.DisplayValue
            }
            return amznBlob;
        }

    }
    //handle an error response instead
    function onError(err){
        console.log(err);
    }
    //return the promise of the result of the request to the api
    //also send the request using a callback to handle the result
    return new Promise( (resolve, reject) =>{
        api.getItems(getItemsRequest, (err, data) =>{
            if (err) {
                onError(err);
                reject(err);
            } else {
                const gotIt = onSuccess(data) ;
                resolve(gotIt);
                }
            })
    })        
}
