import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { INITIAL_INSTRUCTION } from '../constants';

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to hide the key, 
// but for this client-side demo we use the env var directly as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export interface ChatSession {
  sendMessage: (text: string) => Promise<string>;
}

export const createSommelierSession = (): ChatSession => {
  const chat: Chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: INITIAL_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return {
    sendMessage: async (text: string): Promise<string> => {
      try {
        const response: GenerateContentResponse = await chat.sendMessage({ message: text });
        return response.text || "I'm sorry, I poured a blank on that one. Could you try asking again?";
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "My apologies, I seem to be having trouble connecting to the cellar records (API Error). Please try again in a moment.";
      }
    }
  };
};

export const generateWineryDescription = async (wineryName: string, features: string[]): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Write a short, enticing 2-sentence description for ${wineryName} in the Canberra District. Highlight these features: ${features.join(', ')}.`,
        });
        return response.text || "Discover the unique flavors of the Canberra region.";
    } catch (e) {
        return "Discover the unique flavors of the Canberra region.";
    }
}

export interface WineListing {
  name: string;
  price: string;
  link: string;
}

export interface WineSearchResponse {
  wines: WineListing[];
  sources: { title: string; uri: string }[];
}

export const searchWinesForSale = async (wineryName: string, shopUrl?: string): Promise<WineSearchResponse> => {
  try {
    // Specific instruction for problematic sites to ensure correct shop URL is used
    let specificInstruction = "";
    const lowerName = wineryName.toLowerCase();
    
    if (lowerName.includes("eden road")) {
        specificInstruction = `IMPORTANT: For Eden Road Wines, you MUST start your search at https://edenroadwines.com.au/pages/shop. 
        Extract wines listed on that specific page. The deep links should likely look like https://edenroadwines.com.au/products/... 
        If specific product links are unsure or hidden, default to https://edenroadwines.com.au/pages/shop.`;
    } else if (lowerName.includes("collector wines")) {
        specificInstruction = `IMPORTANT: For Collector Wines, you MUST start your search at https://collectorwines.com.au/collections/explore-our-range. 
        Extract wines listed on that specific page. 
        If specific product links are unsure or hidden, default to https://collectorwines.com.au/collections/explore-our-range.`;
    } else if (lowerName.includes("mount majura")) {
        specificInstruction = `IMPORTANT: For Mount Majura Vineyard, you MUST start your search at https://www.mountmajura.com.au/wines/current-releases/.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://www.mountmajura.com.au/wines/current-releases/.`;
    } else if (lowerName.includes("contentious character")) {
        specificInstruction = `IMPORTANT: For Contentious Character, you MUST start your search at https://www.contentiouscharacter.com.au/Wines.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://www.contentiouscharacter.com.au/Wines.`;
    } else if (lowerName.includes("dionysus winery")) {
        specificInstruction = `IMPORTANT: For Dionysus Winery, you MUST start your search at https://www.dionysus-winery.com.au/category/all-products.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://www.dionysus-winery.com.au/category/all-products.`;
    } else if (lowerName.includes("pankhurst wines")) {
        specificInstruction = `IMPORTANT: For Pankhurst Wines, you MUST start your search at https://pankhurstwines.com.au/shop-2/.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://pankhurstwines.com.au/shop-2/.`;
    } else if (lowerName.includes("the vintner's daughter") || lowerName.includes("vintners daughter")) {
        specificInstruction = `IMPORTANT: For The Vintner's Daughter, you MUST start your search at https://thevintnersdaughter.com.au/shop/.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://thevintnersdaughter.com.au/shop/.`;
    } else if (lowerName.includes("mckellar ridge")) {
        specificInstruction = `IMPORTANT: For McKellar Ridge Wines, you MUST start your search at https://www.mckellarridgewines.com.au/buy/wine.
        Extract wines listed on that specific page.
        If specific product links are unsure or hidden, default to https://www.mckellarridgewines.com.au/buy/wine.`;
    } else if (shopUrl) {
        // Generic fallback instruction if a known shop URL is passed from constants
        specificInstruction = `IMPORTANT: Start your search at the official shop page: ${shopUrl}. 
        Prioritize extracting wines visible on this page. 
        If direct product links are not clearly available, use ${shopUrl} as the link.`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Find 5 current wines available for purchase from ${wineryName} in the Canberra District wine region. 
      ${specificInstruction}

      For each wine, provide the full name, price, and a functioning URL to the purchase page.
      
      CRITICAL LINK VALIDATION:
      - Double check the links. Ensure they do not give a 404 error.
      - If a direct link to a specific vintage page (e.g., /2021-shiraz) is likely to be broken, outdated, or result in a 404, YOU MUST provide the URL to the winery's main "Shop", "Our Wines", or "Current Vintages" page instead.
      - It is significantly better to link to a working general store page than a broken specific product page.
      - Review the site structure to find the URL to the sales page that works.
      
      Format each entry on a new line strictly following this pattern:
      Wine Name | Price | URL
      
      Example:
      2023 Estate Shiraz | $42.00 | https://winery-name.com/shop
      
      If a price is not found, write "Price N/A".
      Do not include any bullet points, numbering, or intro/outro text. Only the list lines.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const wines: WineListing[] = [];
    const sources: { title: string; uri: string }[] = [];
    
    // Parse text
    const lines = text.split('\n');
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const parts = line.split('|');
      if (parts.length >= 3) {
        let name = parts[0].replace(/^[*\-\s]+|[*\s]+$/g, '').trim(); 
        let price = parts[1].trim();
        let link = parts[2].trim();
        
        // Basic url cleanup in case markdown leaked in
        const urlMatch = link.match(/(https?:\/\/[^\s)]+)/);
        if (urlMatch) {
            link = urlMatch[0];
        }

        // Clean trailing punctuation that might break the link
        link = link.replace(/[.,;)]+$/, '');

        if (name && link) {
             wines.push({ name, price, link });
        }
      }
    });

    // Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Fallback: If formatted parsing fails but we have text (e.g. model outputted a plain list)
    if (wines.length === 0 && text.trim().length > 0) {
         const fallbackUrl = shopUrl || (sources.length > 0 ? sources[0].uri : `https://www.google.com/search?q=${encodeURIComponent(wineryName + ' wines buy')}`);
         const fallbackLines = text.split('\n').filter(l => l.trim().length > 0);
         
         fallbackLines.forEach(line => {
             // Remove list markers like "1.", "-", "*"
             const cleanLine = line.replace(/^[*\-•\d.]+\s*/, '').trim();
             // Simple heuristic to ignore short headers or empty lines
             if (cleanLine.length > 5) {
                 wines.push({
                     name: cleanLine,
                     price: '',
                     link: fallbackUrl
                 });
             }
         });
    }

    return { wines, sources };
  } catch (error) {
    console.error("Wine search error:", error);
    return { 
      wines: [], 
      sources: [] 
    };
  }
};