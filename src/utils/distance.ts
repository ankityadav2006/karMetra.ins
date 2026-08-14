// Haversine formula to calculate distance in kilometers between two lat/lng coordinates

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place e.g. 3.4 km
}

export interface CityCoordinates {
  name: string;
  lat: number;
  lng: number;
  state: string;
}

export const INDIAN_CITIES: CityCoordinates[] = [
  { name: 'Mumbai', lat: 18.922, lng: 72.8347, state: 'Maharashtra' },
  { name: 'Andheri East', lat: 19.1136, lng: 72.8697, state: 'Maharashtra' },
  { name: 'Lower Parel', lat: 18.9986, lng: 72.8313, state: 'Maharashtra' },
  { name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },
  { name: 'Navi Mumbai', lat: 19.033, lng: 73.0297, state: 'Maharashtra' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.209, state: 'Delhi' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, state: 'Telangana' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
];

export function maskGstin(gstin?: string): string {
  if (!gstin || gstin.length < 10) return 'GSTIN Registered';
  return `${gstin.slice(0, 2)}*****${gstin.slice(-3)}`;
}

export function maskPan(pan?: string): string {
  if (!pan || pan.length < 10) return 'PAN Verified';
  return `${pan.slice(0, 2)}*****${pan.slice(-2)}`;
}
