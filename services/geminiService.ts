import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, SchemaType } from "@google/genai";
import { INITIAL_INSTRUCTION, WINERIES } from '../constants'; // Import WINERIES for the search logic

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

// --- Tool Definitions ---

const wineSearchTool: FunctionDeclaration = {
  name: "find_wines_by_criteria",
  description: "Search for wines available for purchase across multiple wineries in the region based on variety and price.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      variety: {
        type: SchemaType.STRING,
        description: "The grape variety to search for (e.g., 'Shiraz', 'Riesling', 'Pinot Noir')."
      },
      maxPrice: {
        type: SchemaType.NUMBER,
        description: "The maximum price per bottle in AUD (optional)."
      },
      district: {
        type: SchemaType.STRING,
        description: "The specific district to filter by (optional)."
      }
    },
    required: ["variety"]
  }
};

// --- Service Logic ---

export interface ChatSession {
  sendMessage: (text: string) => Promise<string>;
}

export const createSommelierSession = (): ChatSession => {
  const chat: Chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: INITIAL_INSTRUCTION,
      temperature: 0.7,
      tools: [{ functionDeclarations: [wineSearchTool] }], // Register the tool
    },
  });

  return {
    sendMessage: async (text: string): Promise<string> => {
      try {
        // 1. Send user message
        let response = await chat.sendMessage({ message: text });
        let responseText = response.text || "";

        // 2. Check for Tool Calls (Function Calling)
        // Note: The SDK structure for function calls can vary, we check the candidates
        const functionCalls = response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
           const call = functionCalls[0].functionCall;
           
           if (call && call.name === "find_wines_by_criteria") {
               const { variety, maxPrice, district } = call.args as any;
               
               // execute the client-side logic
               const results = await executeCrossWinerySearch(variety, maxPrice, district);
               
               // 3. Send Tool Response back to model
               // We format the results as a JSON string for the model to interpret
               const toolResponse = await chat.sendMessage({
                   message: [
                       {
                           functionResponse: {
                               name: "find_wines_by_criteria",
                               response: { foundWines: results }
                           }
                       }
                   ]
               });
               
               return toolResponse.text || "I found some wines, but I'm having trouble summarizing them.";
           }
        }

        return responseText;
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "My apologies, I seem to be having trouble connecting to the cellar records (API Error). Please try again in a moment.";
      }
    }
  };
};

// --- Helper Functions ---

const executeCrossWinerySearch = async (variety: string, maxPrice?: number, district?: string) => {
    // 1. Identify candidates from static data
    let candidates = WINERIES.filter(w => 
        w.varieties.some(v => v.toLowerCase().includes(variety.toLowerCase()))
    );

    if (district) {
        candidates = candidates.filter(w => w.district.toLowerCase() === district.toLowerCase());
    }

    // 2. Randomly select up to 3 wineries to search (to manage latency/rate limits)
    // In a real app, you might search more or paginate
    const selectedWineries = candidates.sort(() => 0.5 - Math.random()).slice(0, 3);

    if (selectedWineries.length === 0) return { message: "No wineries found known for that variety." };

    // 3. Parallel Search
    const searchPromises = selectedWineries.map(w => searchWinesForSale(w.name, w.shopUrl));
    const results = await Promise.all(searchPromises);

    // 4. Aggregate & Filter
    let allWines: any[] = [];
    results.forEach((res, index) => {
        const wineryName = selectedWineries[index].name;
        res.wines.forEach(wine => {
            // Clean price for comparison
            const priceVal = parseFloat(wine.price.replace(/[^0-9.]/g, ''));
            
            // Check price filter
            if (!maxPrice || (!isNaN(priceVal) && priceVal <= maxPrice)) {
                allWines.push({
                    winery: wineryName,
                    wine: wine.name,
                    price: wine.price,
                    link: wine.link
                });
            }
        });
    });

    return { 
        searchedWineries: selectedWineries.map(w => w.name),
        matches: allWines 
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
    let specificInstruction = "";
    
    if (shopUrl) {
        specificInstruction = `IMPORTANT: Start your search at the official shop page: ${shopUrl}. 
        Prioritize extracting wines visible on this page. 
        If direct product links are not clearly available or likely to 404, use ${shopUrl} as the link.`;
    } else {
        specificInstruction = `Search for the official "Shop" or "Buy Wines" page for ${wineryName}.`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Find 5 current wines available for purchase from ${wineryName} in the Canberra District wine region. 
      ${specificInstruction}

      For each wine, provide the full name, price, and a functioning URL to the purchase page.
      
      CRITICAL LINK VALIDATION:
      - Double check the links. Ensure they do not give a 404 error.
      - If a direct link to a specific vintage page (e.g., /2021-shiraz) is likely to be broken, outdated, or result in a 404, YOU MUST provide the URL to the winery's main "Shop", "Our Wines", or "Current Vintages" page instead.
      
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
        
        const urlMatch = link.match(/(https?:\/\/[^\s)]+)/);
        if (urlMatch) {
            link = urlMatch[0];
        }
        link = link.replace(/[.,;)]+$/, '');

        if (name && link) {
             wines.push({ name, price, link });
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    if (wines.length === 0 && text.trim().length > 0) {
         const fallbackUrl = shopUrl || (sources.length > 0 ? sources[0].uri : `https://www.google.com/search?q=${encodeURIComponent(wineryName + ' wines buy')}`);
         const fallbackLines = text.split('\n').filter(l => l.trim().length > 0);
         
         fallbackLines.forEach(line => {
             const cleanLine = line.replace(/^[*\-•\d.]+\s*/, '').trim();
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
