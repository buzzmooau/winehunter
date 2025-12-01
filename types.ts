export interface Winery {
  id: string;
  name: string;
  district: District;
  description: string;
  varieties: string[];
  coordinates: { x: number; y: number }; // Percentage 0-100 on the schematic map
  address: string;
  phone?: string;
  website?: string;
  shopUrl?: string; // New field for the "Golden Source" shop link
  image: string; // Placeholder URL
}

export enum District {
  Murrumbateman = "Murrumbateman",
  LakeGeorge = "Lake George",
  Majura = "Majura Valley",
  Bungendore = "Bungendore",
  Hall = "Hall",
  Gundaroo = "Gundaroo",
  Wamboin = "Wamboin",
  Collector = "Collector"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
