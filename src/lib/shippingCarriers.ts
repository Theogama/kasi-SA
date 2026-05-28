export interface Carrier {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  estimatedDays: string;
}

export interface PepStore {
  code: string;
  name: string;
  address: string;
  city: string;
  province: string;
}

export interface PargoPoint {
  id: string;
  name: string;
  partner: string;
  address: string;
  city: string;
  province: string;
}

export const CARRIERS: Carrier[] = [
  {
    id: "courier_guy",
    name: "The Courier Guy",
    description: "Door-to-door physical delivery direct to your home or office.",
    price: 100,
    icon: "Truck",
    estimatedDays: "2-3 Business Days",
  },
  {
    id: "paxi_pep",
    name: "PAXI (PEP Stores)",
    description: "Click & Collect at your nearest PEP Store. Ideal for Township/Kasi delivery.",
    price: 60,
    icon: "Store",
    estimatedDays: "3-5 Business Days",
  },
  {
    id: "pargo_collect",
    name: "Pargo Pickup",
    description: "Click & Collect at partner stores like Clicks and FreshStop.",
    price: 80,
    icon: "MapPin",
    estimatedDays: "2-4 Business Days",
  },
];

export const FREE_SHIPPING_THRESHOLD = 1000;

// Curated list of South African PEP Stores (focusing heavily on iconic townships/kasi areas)
export const PEP_STORES: PepStore[] = [
  { code: "PEP-4532", name: "PEP Soweto Maponya Mall", address: "Shop 20, Maponya Mall, Chris Hani Rd, Soweto", city: "Soweto", province: "Gauteng" },
  { code: "PEP-8712", name: "PEP Khayelitsha Mall", address: "Shop 15, Khayelitsha Shopping Centre, Walter Sisulu Rd", city: "Cape Town", province: "Western Cape" },
  { code: "PEP-1145", name: "PEP Mitchells Plain Town Centre", address: "42 Symphony Walk, Mitchells Plain Town Centre", city: "Cape Town", province: "Western Cape" },
  { code: "PEP-9982", name: "PEP Umlazi Mega City", address: "Shop A32, Umlazi Mega City, Griffiths Mxenge Hwy", city: "Durban", province: "KwaZulu-Natal" },
  { code: "PEP-6021", name: "PEP Mdantsane City Mall", address: "Shop 52, Mdantsane City Mall, Billie Rd", city: "East London", province: "Eastern Cape" },
  { code: "PEP-3310", name: "PEP Alexandra Alex Mall", address: "Shop 8, Alex Mall, Far East Bank Dr & London Rd", city: "Johannesburg", province: "Gauteng" },
  { code: "PEP-5491", name: "PEP Tembisa Plaza", address: "Shop 4, Tembisa Plaza, Andrew Mapheto Dr", city: "Tembisa", province: "Gauteng" },
  { code: "PEP-7744", name: "PEP Sandton City", address: "Shop L315, Sandton City Mall, Rivonia Rd & 5th St", city: "Sandton", province: "Gauteng" },
  { code: "PEP-2090", name: "PEP Mamelodi Denlyn Mall", address: "Shop G24, Denlyn Shopping Centre, Maphalla Dr", city: "Pretoria", province: "Gauteng" },
  { code: "PEP-1823", name: "PEP Durban Workshop", address: "Shop 102, The Workshop Shopping Centre, Samora Machel St", city: "Durban", province: "KwaZulu-Natal" },
  { code: "PEP-8921", name: "PEP Port Elizabeth Kenako Mall", address: "Shop 12, Kenako Mall, Sinton Rd, New Brighton", city: "Gqeberha", province: "Eastern Cape" },
  { code: "PEP-4450", name: "PEP Mitchells Plain Promenade", address: "Shop 82, Liberty Promenade Mall, AZ Berman Dr", city: "Cape Town", province: "Western Cape" }
];

// Curated list of Pargo pickup points
export const PARGO_POINTS: PargoPoint[] = [
  { id: "PAR-C01", name: "Clicks Sandton City", partner: "Clicks", address: "Shop L12, Sandton City, Rivonia Rd & 5th St", city: "Sandton", province: "Gauteng" },
  { id: "PAR-F02", name: "FreshStop Pioneer Soweto", partner: "FreshStop", address: "Caltex Garage, 1142 Chris Hani Rd, Pimville", city: "Soweto", province: "Gauteng" },
  { id: "PAR-C03", name: "Clicks Khayelitsha", partner: "Clicks", address: "Shop G10, Khayelitsha Mall, Walter Sisulu Rd", city: "Cape Town", province: "Western Cape" },
  { id: "PAR-F04", name: "FreshStop BP Mitchells Plain", partner: "FreshStop", address: "BP Garage, Eisleben Rd & Morgenster Rd", city: "Cape Town", province: "Western Cape" },
  { id: "PAR-C05", name: "Clicks Umlazi Mega City", partner: "Clicks", address: "Shop B10, Umlazi Mega City, Griffiths Mxenge Hwy", city: "Durban", province: "KwaZulu-Natal" },
  { id: "PAR-C06", name: "Clicks Mdantsane City", partner: "Clicks", address: "Shop 12, Mdantsane City Mall, Billie Rd", city: "East London", province: "Eastern Cape" },
  { id: "PAR-F07", name: "FreshStop Caltex Alexandra", partner: "FreshStop", address: "Caltex Garage, 102 London Rd, Alexandra", city: "Johannesburg", province: "Gauteng" },
  { id: "PAR-C08", name: "Clicks Tembisa Mall", partner: "Clicks", address: "Shop 62, Mall of Tembisa, Olifantsfontein Rd", city: "Tembisa", province: "Gauteng" }
];
