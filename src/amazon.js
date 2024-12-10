import { AMAZON_KEY,
    AMAZON_SECRET,
    AMAZON_PARTNER_TAG } from './definitions.js'

export async function getAmznBlob(amznProdID) {
    const newStr = `${amznProdID} + ${AMAZON_KEY}`;
    return newStr;
}
