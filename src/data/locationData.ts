export interface LocationNode {
  id: string;
  name: string;
  type: 'state' | 'district' | 'city' | 'town' | 'village' | 'area' | 'locality';
  state: string;
  district: string;
  city?: string;
  pincode?: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export const INDIAN_LOCATIONS_DATABASE: LocationNode[] = [
  // --- MAHARASHTRA ---
  // Mumbai & Suburban Areas
  { id: 'loc-mum-andheri-e', name: 'Andheri East', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400069', lat: 19.1136, lng: 72.8697, popular: true },
  { id: 'loc-mum-andheri-w', name: 'Andheri West', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400058', lat: 19.1197, lng: 72.8464, popular: true },
  { id: 'loc-mum-powai', name: 'Powai (Hiranandani)', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400076', lat: 19.1176, lng: 72.9060, popular: true },
  { id: 'loc-mum-bandra', name: 'Bandra Kurla Complex (BKC)', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400051', lat: 19.0667, lng: 72.8697, popular: true },
  { id: 'loc-mum-lower-parel', name: 'Lower Parel', type: 'area', state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai', pincode: '400013', lat: 18.9986, lng: 72.8313, popular: true },
  { id: 'loc-mum-dadar', name: 'Dadar', type: 'area', state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai', pincode: '400028', lat: 19.0178, lng: 72.8478, popular: true },
  { id: 'loc-mum-kurla', name: 'Kurla West', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400070', lat: 19.0688, lng: 72.8839 },
  { id: 'loc-mum-borivali', name: 'Borivali West', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400092', lat: 19.2288, lng: 72.8541 },
  { id: 'loc-mum-malad', name: 'Malad West (Mindspace)', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400064', lat: 19.1860, lng: 72.8485 },
  { id: 'loc-mum-ghatkopar', name: 'Ghatkopar East', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400077', lat: 19.0856, lng: 72.9083 },
  { id: 'loc-mum-kandivali', name: 'Kandivali East', type: 'area', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', pincode: '400101', lat: 19.2061, lng: 72.8687 },

  // Thane District & Bhiwandi Towns / Villages
  { id: 'loc-thane-w', name: 'Thane West (Majiwada)', type: 'city', state: 'Maharashtra', district: 'Thane', city: 'Thane', pincode: '400601', lat: 19.2183, lng: 72.9781, popular: true },
  { id: 'loc-thane-ghodbunder', name: 'Ghodbunder Road', type: 'area', state: 'Maharashtra', district: 'Thane', city: 'Thane', pincode: '400615', lat: 19.2612, lng: 72.9514 },
  { id: 'loc-bhiwandi-town', name: 'Bhiwandi (Logistics & Textile Hub)', type: 'town', state: 'Maharashtra', district: 'Thane', city: 'Bhiwandi', pincode: '421302', lat: 19.2967, lng: 73.0631, popular: true },
  { id: 'loc-bhiwandi-mankoli', name: 'Mankoli (Warehouse Zone)', type: 'village', state: 'Maharashtra', district: 'Thane', city: 'Bhiwandi', pincode: '421302', lat: 19.2840, lng: 73.0450 },
  { id: 'loc-bhiwandi-padgha', name: 'Padgha Village', type: 'village', state: 'Maharashtra', district: 'Thane', city: 'Bhiwandi', pincode: '421101', lat: 19.3490, lng: 73.1610 },
  { id: 'loc-kalyan-w', name: 'Kalyan West', type: 'city', state: 'Maharashtra', district: 'Thane', city: 'Kalyan', pincode: '421301', lat: 19.2437, lng: 73.1355 },
  { id: 'loc-dombivli-e', name: 'Dombivli East (MIDC)', type: 'town', state: 'Maharashtra', district: 'Thane', city: 'Dombivli', pincode: '421201', lat: 19.2184, lng: 73.0867 },
  { id: 'loc-mumbra', name: 'Mumbra', type: 'town', state: 'Maharashtra', district: 'Thane', city: 'Thane', pincode: '400612', lat: 19.1906, lng: 73.0229 },

  // Palghar District & Villages
  { id: 'loc-palghar-town', name: 'Palghar Town', type: 'town', state: 'Maharashtra', district: 'Palghar', city: 'Palghar', pincode: '401404', lat: 19.6967, lng: 72.7699 },
  { id: 'loc-palghar-manor', name: 'Manor Village (Industrial Belt)', type: 'village', state: 'Maharashtra', district: 'Palghar', city: 'Palghar', pincode: '401403', lat: 19.7420, lng: 72.9120 },
  { id: 'loc-palghar-tarapur', name: 'Tarapur (MIDC Zone)', type: 'town', state: 'Maharashtra', district: 'Palghar', city: 'Boisar', pincode: '401506', lat: 19.8247, lng: 72.6710 },
  { id: 'loc-palghar-vasai', name: 'Vasai East', type: 'city', state: 'Maharashtra', district: 'Palghar', city: 'Vasai-Virar', pincode: '401208', lat: 19.3919, lng: 72.8397 },
  { id: 'loc-palghar-virar', name: 'Virar West', type: 'city', state: 'Maharashtra', district: 'Palghar', city: 'Vasai-Virar', pincode: '401303', lat: 19.4674, lng: 72.8055 },

  // Navi Mumbai
  { id: 'loc-nm-vashi', name: 'Vashi (APMC Market)', type: 'area', state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai', pincode: '400703', lat: 19.0771, lng: 72.9986, popular: true },
  { id: 'loc-nm-airoli', name: 'Airoli (Mindspace Tech Park)', type: 'area', state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai', pincode: '400708', lat: 19.1579, lng: 72.9935, popular: true },
  { id: 'loc-nm-panvel', name: 'Panvel (Logistics Park)', type: 'city', state: 'Maharashtra', district: 'Raigad', city: 'Navi Mumbai', pincode: '410206', lat: 18.9894, lng: 73.1175 },
  { id: 'loc-nm-mahape', name: 'Mahape (Millennium Business Park)', type: 'area', state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai', pincode: '400710', lat: 19.1172, lng: 73.0189 },
  { id: 'loc-nm-taloja', name: 'Taloja (MIDC Industrial Area)', type: 'town', state: 'Maharashtra', district: 'Raigad', city: 'Navi Mumbai', pincode: '410208', lat: 19.0532, lng: 73.1250 },

  // Pune District
  { id: 'loc-pune-hinjewadi', name: 'Hinjewadi (Phase 1-3 Tech Park)', type: 'area', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '411057', lat: 18.5913, lng: 73.7389, popular: true },
  { id: 'loc-pune-kharadi', name: 'Kharadi (EON Free Zone)', type: 'area', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '411014', lat: 18.5516, lng: 73.9349, popular: true },
  { id: 'loc-pune-chakan', name: 'Chakan (Automobile & MIDC Hub)', type: 'town', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '410501', lat: 18.7606, lng: 73.8617, popular: true },
  { id: 'loc-pune-hadapsar', name: 'Hadapsar (Magarpatta City)', type: 'area', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '411028', lat: 18.5089, lng: 73.9259 },
  { id: 'loc-pune-shikrapur', name: 'Shikrapur Village (Logistics Corridor)', type: 'village', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '412208', lat: 18.7067, lng: 74.1283 },
  { id: 'loc-pune-talegaon', name: 'Talegaon Dabhade', type: 'town', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '410506', lat: 18.7303, lng: 73.6826 },

  // Other Maharashtra Hubs
  { id: 'loc-nagpur-midc', name: 'Nagpur (MIHAN & Butibori)', type: 'city', state: 'Maharashtra', district: 'Nagpur', city: 'Nagpur', pincode: '440001', lat: 21.1458, lng: 79.0882 },
  { id: 'loc-nashik-satpur', name: 'Nashik (Satpur / Ambad MIDC)', type: 'city', state: 'Maharashtra', district: 'Nashik', city: 'Nashik', pincode: '422007', lat: 19.9975, lng: 73.7898 },
  { id: 'loc-aurangabad-waluj', name: 'Chhatrapati Sambhajinagar (Waluj MIDC)', type: 'city', state: 'Maharashtra', district: 'Aurangabad', city: 'Aurangabad', pincode: '431136', lat: 19.8762, lng: 75.3433 },
  { id: 'loc-kolhapur-shiroli', name: 'Kolhapur (Shiroli MIDC)', type: 'city', state: 'Maharashtra', district: 'Kolhapur', city: 'Kolhapur', pincode: '416122', lat: 16.7050, lng: 74.2433 },

  // --- DELHI NCR ---
  { id: 'loc-delhi-cp', name: 'Connaught Place', type: 'area', state: 'Delhi', district: 'New Delhi', city: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167, popular: true },
  { id: 'loc-delhi-nehru-place', name: 'Nehru Place (Commercial Hub)', type: 'area', state: 'Delhi', district: 'South Delhi', city: 'Delhi', pincode: '110019', lat: 28.5492, lng: 77.2530, popular: true },
  { id: 'loc-delhi-okhla', name: 'Okhla Industrial Area (Phases 1-3)', type: 'area', state: 'Delhi', district: 'South East Delhi', city: 'Delhi', pincode: '110020', lat: 28.5284, lng: 77.2764, popular: true },
  { id: 'loc-delhi-dwarka', name: 'Dwarka Sector 21', type: 'area', state: 'Delhi', district: 'South West Delhi', city: 'Delhi', pincode: '110075', lat: 28.5528, lng: 77.0588 },
  { id: 'loc-delhi-narela', name: 'Narela Industrial Park & Village', type: 'town', state: 'Delhi', district: 'North Delhi', city: 'Delhi', pincode: '110040', lat: 28.8527, lng: 77.0927 },
  { id: 'loc-delhi-bawana', name: 'Bawana Industrial Area & Village', type: 'village', state: 'Delhi', district: 'North Delhi', city: 'Delhi', pincode: '110039', lat: 28.7967, lng: 77.0392 },
  { id: 'loc-ncr-cybercity', name: 'Gurgaon Cyber City (DLF Phase 2)', type: 'area', state: 'Haryana', district: 'Gurugram', city: 'Gurugram', pincode: '122002', lat: 28.4908, lng: 77.0911, popular: true },
  { id: 'loc-ncr-manesar', name: 'Manesar (IMT Industrial Area & Village)', type: 'town', state: 'Haryana', district: 'Gurugram', city: 'Gurugram', pincode: '122051', lat: 28.3588, lng: 76.9405, popular: true },
  { id: 'loc-ncr-noida-sec62', name: 'Noida Sector 62 (Electronic City)', type: 'area', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Noida', pincode: '201309', lat: 28.6270, lng: 77.3725, popular: true },
  { id: 'loc-ncr-greater-noida', name: 'Greater Noida (Kasna & Surajpur Village)', type: 'town', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Greater Noida', pincode: '201306', lat: 28.4744, lng: 77.5040 },
  { id: 'loc-ncr-faridabad', name: 'Faridabad (Sector 15 & NIT)', type: 'city', state: 'Haryana', district: 'Faridabad', city: 'Faridabad', pincode: '121001', lat: 28.4089, lng: 77.3178 },

  // --- KARNATAKA (Bangalore & Hubs) ---
  { id: 'loc-blr-koramangala', name: 'Koramangala (Startups & Hub)', type: 'area', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bangalore', pincode: '560034', lat: 12.9352, lng: 77.6245, popular: true },
  { id: 'loc-blr-whitefield', name: 'Whitefield (ITPL & EPIP Zone)', type: 'area', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bangalore', pincode: '560066', lat: 12.9698, lng: 77.7500, popular: true },
  { id: 'loc-blr-ecity', name: 'Electronic City (Phase 1 & 2)', type: 'area', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bangalore', pincode: '560100', lat: 12.8399, lng: 77.6770, popular: true },
  { id: 'loc-blr-peenya', name: 'Peenya Industrial Area', type: 'area', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bangalore', pincode: '560058', lat: 13.0285, lng: 77.5197, popular: true },
  { id: 'loc-blr-hoskote', name: 'Hoskote (Automotive & Warehouse Hub)', type: 'town', state: 'Karnataka', district: 'Bengaluru Rural', city: 'Bangalore Rural', pincode: '562114', lat: 13.0712, lng: 77.7981 },
  { id: 'loc-blr-nelamangala', name: 'Nelamangala (Logistics Corridor & Villages)', type: 'town', state: 'Karnataka', district: 'Bengaluru Rural', city: 'Bangalore Rural', pincode: '562123', lat: 13.0970, lng: 77.3917 },
  { id: 'loc-kar-mysore', name: 'Mysuru (Hebbal Industrial Area)', type: 'city', state: 'Karnataka', district: 'Mysuru', city: 'Mysuru', pincode: '570016', lat: 12.2958, lng: 76.6394 },

  // --- TELANGANA (Hyderabad) ---
  { id: 'loc-hyd-hitec', name: 'HITEC City / Madhapur', type: 'area', state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', pincode: '500081', lat: 17.4474, lng: 78.3762, popular: true },
  { id: 'loc-hyd-gachibowli', name: 'Gachibowli (Financial District)', type: 'area', state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', pincode: '500032', lat: 17.4401, lng: 78.3489, popular: true },
  { id: 'loc-hyd-jeedimetla', name: 'Jeedimetla Industrial Area', type: 'area', state: 'Telangana', district: 'Medchal-Malkajgiri', city: 'Hyderabad', pincode: '500055', lat: 17.5190, lng: 78.4720 },
  { id: 'loc-hyd-shamshabad', name: 'Shamshabad (Airport Logistics & Villages)', type: 'town', state: 'Telangana', district: 'Ranga Reddy', city: 'Hyderabad', pincode: '501218', lat: 17.2543, lng: 78.4311 },

  // --- TAMIL NADU (Chennai & Coimbatore) ---
  { id: 'loc-chn-guindy', name: 'Guindy (Industrial Estate)', type: 'area', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', pincode: '600032', lat: 13.0067, lng: 80.2026, popular: true },
  { id: 'loc-chn-omr', name: 'OMR (IT Expressway & Sholinganallur)', type: 'area', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', pincode: '600119', lat: 12.9010, lng: 80.2279, popular: true },
  { id: 'loc-chn-sriperumbudur', name: 'Sriperumbudur (Electronics & Auto SEZ)', type: 'town', state: 'Tamil Nadu', district: 'Kanchipuram', city: 'Chennai Outer', pincode: '602105', lat: 12.9696, lng: 79.9419, popular: true },
  { id: 'loc-cbe-peelamedu', name: 'Coimbatore (Peelamedu & SIDCO)', type: 'city', state: 'Tamil Nadu', district: 'Coimbatore', city: 'Coimbatore', pincode: '641004', lat: 11.0168, lng: 76.9558 },

  // --- GUJARAT (Ahmedabad, Surat, Sanand) ---
  { id: 'loc-ahm-sg-hwy', name: 'SG Highway / Prahlad Nagar', type: 'area', state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', pincode: '380015', lat: 23.0131, lng: 72.5080, popular: true },
  { id: 'loc-ahm-changodar', name: 'Changodar (Industrial & Warehouse Hub)', type: 'town', state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', pincode: '382213', lat: 22.9238, lng: 72.4414 },
  { id: 'loc-ahm-sanand', name: 'Sanand (Automotive GIDC & Villages)', type: 'town', state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', pincode: '382110', lat: 22.9866, lng: 72.3804, popular: true },
  { id: 'loc-guj-surat', name: 'Surat (Sachin GIDC & Diamond Bourse)', type: 'city', state: 'Gujarat', district: 'Surat', city: 'Surat', pincode: '394230', lat: 21.1702, lng: 72.8311 },
  { id: 'loc-guj-vadodara', name: 'Vadodara (Makarpura GIDC)', type: 'city', state: 'Gujarat', district: 'Vadodara', city: 'Vadodara', pincode: '390010', lat: 22.3072, lng: 73.1812 },

  // --- UTTAR PRADESH & BIHAR (Lucknow, Kanpur, Patna, Villages) ---
  { id: 'loc-up-lucknow-gomti', name: 'Gomti Nagar', type: 'area', state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow', pincode: '226010', lat: 26.8500, lng: 80.9900, popular: true },
  { id: 'loc-up-kanpur-panki', name: 'Panki Industrial Estate', type: 'town', state: 'Uttar Pradesh', district: 'Kanpur Nagar', city: 'Kanpur', pincode: '208020', lat: 26.4716, lng: 80.2444 },
  { id: 'loc-up-varanasi', name: 'Varanasi (Ramnagar Industrial Zone)', type: 'city', state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi', pincode: '221008', lat: 25.3176, lng: 82.9739 },
  { id: 'loc-bihar-patna', name: 'Patna (Patliputra Industrial Area)', type: 'city', state: 'Bihar', district: 'Patna', city: 'Patna', pincode: '800013', lat: 25.5941, lng: 85.1376 },
  { id: 'loc-bihar-muzaffarpur', name: 'Muzaffarpur (Bela Industrial Area)', type: 'city', state: 'Bihar', district: 'Muzaffarpur', city: 'Muzaffarpur', pincode: '842005', lat: 26.1209, lng: 85.3647 },

  // --- RAJASTHAN, PUNJAB, MADHYA PRADESH, WEST BENGAL ---
  { id: 'loc-raj-jaipur-sitapura', name: 'Jaipur (Sitapura Industrial Area)', type: 'area', state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur', pincode: '302022', lat: 26.7820, lng: 75.8240, popular: true },
  { id: 'loc-punjab-ludhiana', name: 'Ludhiana (Focal Point Industrial Hub)', type: 'city', state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana', pincode: '141010', lat: 30.9010, lng: 75.8573 },
  { id: 'loc-mp-indore', name: 'Indore (Pithampur Industrial Area & Villages)', type: 'town', state: 'Madhya Pradesh', district: 'Dhar', city: 'Indore Outer', pincode: '454775', lat: 22.6013, lng: 75.6811, popular: true },
  { id: 'loc-mp-bhopal', name: 'Bhopal (Mandideep Industrial Area)', type: 'town', state: 'Madhya Pradesh', district: 'Raisen', city: 'Bhopal Outer', pincode: '462046', lat: 23.0722, lng: 77.5255 },
  { id: 'loc-wb-kolkata-saltlake', name: 'Salt Lake Sector V (IT Hub)', type: 'area', state: 'West Bengal', district: 'North 24 Parganas', city: 'Kolkata', pincode: '700091', lat: 22.5804, lng: 88.4378, popular: true },
  { id: 'loc-wb-howrah-dhulagarh', name: 'Howrah (Dhulagarh Logistics & Truck Hub)', type: 'town', state: 'West Bengal', district: 'Howrah', city: 'Howrah', pincode: '711302', lat: 22.5700, lng: 88.1800 },
];

/**
 * Calculates geographic distance using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest Indian locality/village/city given GPS coordinates
 */
export function reverseGeocodeNearest(
  lat: number,
  lng: number
): LocationNode {
  let closest = INDIAN_LOCATIONS_DATABASE[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (const node of INDIAN_LOCATIONS_DATABASE) {
    const dist = calculateDistanceKm(lat, lng, node.lat, node.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = node;
    }
  }

  return closest;
}

/**
 * Suggests locations matching search query (city, area, village, pincode, district, state)
 */
export function searchLocations(query: string, limit = 8): LocationNode[] {
  if (!query || query.trim().length === 0) {
    return INDIAN_LOCATIONS_DATABASE.filter((n) => n.popular).slice(0, limit);
  }

  const q = query.toLowerCase().trim();
  return INDIAN_LOCATIONS_DATABASE.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      (loc.city && loc.city.toLowerCase().includes(q)) ||
      loc.district.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      (loc.pincode && loc.pincode.includes(q))
  ).slice(0, limit);
}
