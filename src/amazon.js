import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies.js';
import { AMAZON_KEY,
    AMAZON_SECRET,
    AMAZON_PARTNER_TAG } from './definitions.js';

import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk';


export async function getAmznBlob(amznProdID) {
    const newStr = `${amznProdID} + ${AMAZON_KEY}`;

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
    // getItemsRequest['ItemIds'] = [amznProdID];
    getItemsRequest['ItemIds']  = ['B002MAPN62']; //static ID used in dev testing
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

    //define an object to return the api response, should match 'Resources' 
    let amznBlob = {
        imgPrimary: "",
        imgVariants: "",
        itemTitle: "",
        itemFeatures: ""
    }
    
    /**
     * Function to parse GetItemsResponse into an object with key as ASIN
     */
    function parseResponse(itemsResponseList) {
        var mappedResponse = {};
        for (var i in itemsResponseList) {
        if (itemsResponseList.hasOwnProperty(i)) {
            mappedResponse[itemsResponseList[i]['ASIN']] = itemsResponseList[i];
        }
        }
        return mappedResponse;
    }

    

    function tryAPIcall(getItemsRequest) {
        function onSuccess(data){
            // console.log(data);
            let getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
            // console.log(getItemsResponse);
            if (getItemsResponse['ItemsResult'] !== undefined) {
                let responseList = getItemsResponse['ItemsResult']['Items'];
                // console.log(responseList[0]);
                console.log(responseList[0].DetailPageURL);
                console.log(responseList[0].Images.Primary.Medium.URL);
                console.log(responseList[0].Images.Variants);
                console.log(responseList[0].ItemInfo.Title.DisplayValue);
                console.log(responseList[0].ItemInfo.Features.DisplayValues);
            }

        }
        function onError(err){
            console.log(err);
        }
                
        try {
            api.getItems(getItemsRequest, (err, data) =>{
                if (err) {
                    onError(error);
                } else {
                    const gotIt = onSuccess(data);
                    return gotIt;
                }
            })
        } catch {

        }    
    }
   

    
    const itemResp = tryAPIcall(getItemsRequest);
    console.log('logging resp')
    console.log(itemResp);
    

        
    // let getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
    // console.log('loggin resp');
    // console.log(resp);
    // console.log('Complete Response: \n' + JSON.stringify(getItemsResponse, null, 1));
    // let response_list = parseResponse(getItemsResponse['ItemsResult']['Items']);
    
    return newStr;
}
