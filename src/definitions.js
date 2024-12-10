
export const AMAZON_PARTNER_TAG = process.env.PARTNER_TAG;
export const AMAZON_KEY = process.env.AMAZON_ACCESS_KEY;
export const AMAZON_SECRET = process.env.AMAZON_SECRET;

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export const WF_TOKEN = process.env.WF_BEARER;

//staticVars with hardcoded details can be overriden with env vars
const category = process.env.PROD_CATEGORY || "liberator";
const collectionID = process.env.PROD_COLLECTION_ID || "651c913b7994a3d05d5a509a";
const partnerLinkLabel = process.env.PARTNER_LINK_LABEL || "Shop Liberator";
const excludeFromMustHaves = true; //TRUE or FALSE
const enableRatings = true; //TRUE or FALSE

export const staticVars = {
    category: category,
    collectionID:collectionID,
    partnerLinkLabel: partnerLinkLabel,
    excludeFromMustHaves: excludeFromMustHaves,
    enableRatings:enableRatings
}
        
        
        
