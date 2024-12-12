import Anthropic from "@anthropic-ai/sdk";

import { ANTHROPIC_API_KEY } from './definitions.js';

const anthropic = new Anthropic({
    // defaults to process.env["ANTHROPIC_API_KEY"]
    apiKey: ANTHROPIC_API_KEY 
  });

const tool = {
    "name": "generate_product_content",
    "description": "You are a professional copywriter who is also experienced with polyamory. You write product summaries and marketing content that is concise, fun and witty",
    "input_schema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "The name of the product shortened to 60 chars in length, e.g. Brandname Item Name"
        },
        "shortDesc": {
          "type": "string",
          "description": "A very short tagline for the product based its FEATURES"
        },
        "content": {
          "type": "string",
          "description": "A three to five paragraph product review using common polyamory keywords than incorporates details from the product's features and is formatted with html tags."
        },
        "reviewHeadline": {
          "type": "string",
          "description": "A catchy one liner describing the product"
        },
        "prosList": {
          "type": "string",
          "description": "an html formatted bullet list of 3 pros based on the product's features"
        },
        "consList": {
          "type": "string",
          "description": "an html formatted bullet list of 3 cons about the product"
        }
      },
      "required": [
        "title",
        "shortDesc",
        "content",
        "reviewHeadline",
        "prosList",
        "consList"
      ]
    }
  };

const example = "<examples>\n<example>\n<FEATURES>\nHITACHI MAGIC WAND TOY MOUNT - Liberator toy mount for Hitachi Magic Wand; Tapered form comfortably cups your body to offer support and gives completely hands-free access to your Magic Wand\nPERFECT FOR STRADDLING - Toy mount's narrow body is perfect for straddling, and the height adds lift and easy access in standing or laying down positions, making it ideal for couple's play\nDESIGNED FOR MAGIC - Ergonomically designed to be paired with a Hitachi Magic Wand; Magic Wand not included\nMACHINE WASHABLE - High-density foam for firm, supportive cushioning, lush cover, and moisture-proof inner nylon liner. Cover is removable and machine washable\n1 YEAR WARRANTY | MADE IN USA – Includes 1 year warranty. If there is any issue with your product, please contact customer service. Proudly made at our manufacturing facility in Atlanta\n</FEATURES>\n<ideal_output>\n{\n  \"title\": \"HITACHI MAGIC WAND TOY MOUNT\",\n  \"shortDesc\": \"Hands-Free Magic for Your Polycule Playtime!\",\n  \"reviewHeadline\": \"Designed for hands-free pleasure, it's perfect for triads, quads, or more!\",\n  \"prosList\": \"<ul><li>Versatile for multiple partner configurations</li><li>Hands-free design allows focus on other partners</li><li>Easy to clean for worry-free sharing</li><ul>\",\n  \"consList\": \"<ul><li>Hitachi Magic Wand not included</li><li>May require creativity for larger group settings</li><li>Single-person use might feel less intimate</li><ul>\"\n}\n\n</ideal_output>\n</example>\n</examples>\n\n";

const systemPrompt = "You are a professional copywriter who is also experienced with polyamory. You write product summaries and marketing content that is concise, fun and witty and you're educated on topics related to polyamorous relationships, and ethical non-monogamy. ";
  

export async function generateContent(features) {
    const FEATURES = features.join(',');
    // do stuff with claude
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0.1,
        system: systemPrompt,
        tools: [tool],
        tool_choice: {
            "type": "tool", 
            "name": "generate_product_content"
        },
        messages: [
            {
              "role": "user",
              "content": [
                {
                    "type": "text",
                    "text": example
                  },
                {
                  "type": "text",
                  "text": `"I'm going to give you a list of features for a product that I'd like you to write about. here is the feature list:${FEATURES}. Using those features, and the 'generate_product_content' tool, please return the product page copy for a polyamorous website as a json object."`
                }
              ]
            }
        ]
    })
    const contentBlob = msg.content[0].input;
    return contentBlob;
}

