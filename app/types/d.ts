export interface Event {
  "@context": string;
  "@id": string;
  "@type": string;
  id: string;
  thumbnail: string;
  title: string;
  timestamp: string;
  place: string;
  lat: number;
  long: number;
  overview: string;
  tags: [string];
  status: string;
  capacity: number;
  remaining: number;
  unlimited: boolean;
  price: number;
  organizer: string;
  bookings: string[];
  reports: string[];
}

export interface Location {
  lat: number;
  lng: number;
  place: string;
  price: number;
  id: string;
}