import { WebflowClient } from "webflow-api";

import { WF_TOKEN } from './definitions.js';

export async function makeWFitem(product) {
    try {
        const client = new WebflowClient({ accessToken: WF_TOKEN });
        const wfResponse = await client.collections.items.createItem(
            product.collectionID, {
            isArchived: false,
            isDraft: true,
            fieldData: {
                "name": product.name,
                "slug": product.slug,
                "category": product.category,
                "image": {
                    "url": product.pageHeaderImage,
                    "alt": null
                },
                "main-product-image": {
                    "url": product.mainProductImage,
                    "alt": null
                },
                "photo-gallery": product.photoGallery, //previously constructed array of small urls
                "include-in-tools-list": product.excludeFromMustHaveList,
                "ratings-reviews-enabled": product.enableRatings,
                "product-description": product.shortProdDesc,
                "long-product-description": product.longProdDesc,
                "review-content": product.reviewPageContent,
                "review-snippet": product.reviewSnippet,
                "review-title": product.reviewHeadline,
                "pros": product.prosList,
                "cons": product.consList,
                "buy-link": product.amznLink,
                "partner-link": product.partnerLink,
                "partner-link-label": product.partnerLinkLabel
            }
        });
        console.log('product created in webflow')
        console.log(wfResponse.fieldData);
        return wfResponse;
    } catch (error) {
        console.log(error);
        return error;
    }
}