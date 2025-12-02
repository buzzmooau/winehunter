import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { INITIAL_INSTRUCTION, WINERIES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

// --- Tool Definitions ---

const wineSearchTool: FunctionDeclaration = {
  name: "find_wines_by_criteria",
  description: "Search for wines available for purchase across multiple wineries in the region based on variety and price.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      variety: {
        type: Type.STRING,
        description: "The grape variety to search for (e.g., 'Shiraz', 'Riesling', 'Pinot Noir')."
      },
      maxPrice: {
        type: Type.NUMBER,
        description: "The maximum price per bottle in AUD (optional)."
      },
      district: {
        type: Type.STRING,
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
      tools: [{ functionDeclarations: [wineSearchTool] }],
    },
  });

  return {
    sendMessage: async (text: string): Promise<string> => {
      try {
        let response = await chat.sendMessage({ message: text });
        let responseText = response.text || "";

        // Check for Tool Calls
        const functionCalls = response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
           const call = functionCalls[0].functionCall;
           if (call && call.name === "find_wines_by_criteria") {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               const { variety, maxPrice, district } = call.args as any;
               const results = await executeCrossWinerySearch(variety, maxPrice, district);
               
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
    let candidates = WINERIES.filter(w => 
        w.varieties.some(v => v.toLowerCase().includes(variety.toLowerCase()))
    );

    if (district) {
        candidates = candidates.filter(w => w.district.toLowerCase() === district.toLowerCase());
    }

    // Select up to 3 wineries to manage latency
    const selectedWineries = candidates.sort(() => 0.5 - Math.random()).slice(0, 3);

    if (selectedWineries.length === 0) return { message: "No wineries found known for that variety." };

    const searchPromises = selectedWineries.map(w => searchWinesForSale(w.name, w.shopUrl));
    const results = await Promise.all(searchPromises);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allWines: any[] = [];
    results.forEach((res, index) => {
        const wineryName = selectedWineries[index].name;
        res.wines.forEach(wine => {
            const priceVal = parseFloat(wine.price.replace(/[^0-9.]/g, ''));
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

    return { searchedWineries: selectedWineries.map(w => w.name), matches: allWines };
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
    // FALLBACK: If no specific shop URL is known, default to a Google Search
    const safeShopUrl = shopUrl || `https://www.google.com/search?q=${encodeURIComponent(wineryName + ' wines buy')}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Find 5 current wines available for purchase from ${wineryName} in the Canberra District wine region.
      
      IMPORTANT - URL SAFETY RULES:
      1. You are searching for wines listed on this specific store page: ${safeShopUrl}
      2. If you see a specific product link (like ".../product/2023-shiraz") in the search results, use it.
      3. CRITICAL: If you CANNOT confirm the specific product link exists, you MUST return the main shop URL: ${safeShopUrl}
      4. DO NOT guess or construct deep links (e.g. do not guess ".../2022-vintage" if you didn't see it). 
      5. It is better to link to the main store page than to send the user to a 404 error.

      Format each entry on a new line strictly following this pattern:
      Wine Name | Price | URL
      
      Example:
      2023 Estate Shiraz | $42.00 | ${safeShopUrl}
      2024 Riesling | $35.00 | https://winery.com/product/riesling-24
      
      If a price is not found, write "Price N/A".
      Only output the list lines.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const wines: WineListing[] = [];
    const sources: { title: string; uri: string }[] = [];
    
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

        // FINAL SAFETY CHECK: If the link is empty or invalid, force the shopUrl
        if (!link || !link.startsWith('http')) {
            link = safeShopUrl;
        }

        if (name) {
             wines.push({ name, price, link });
        }
      }
    });

    // Capture sources for citation if needed
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Fallback if formatting failed entirely
    if (wines.length === 0 && text.trim().length > 0) {
         const fallbackLines = text.split('\n').filter(l => l.trim().length > 0);
         fallbackLines.forEach(line => {
             const cleanLine = line.replace(/^[*\-•\d.]+\s*/, '').trim();
             if (cleanLine.length > 5) {
                 wines.push({
                     name: cleanLine,
                     price: '',
                     link: safeShopUrl
                 });
             }
         });
    }

    return { wines, sources };
  } catch (error) {
    console.error("Wine search error:", error);
    return { wines: [], sources: [] };
  }
};

// Export Alias to fix import errors in components expecting 'smartWineSearch'
export const smartWineSearch = searchWinesForSale;