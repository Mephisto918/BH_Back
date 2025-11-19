export interface MapMarker {
  id: number;
  name: string;
  thumbnail: string | null;
  priceRange: {
    highestPrice: number;
    lowestPrice: number;
  };
  lat: number;
  lng: number;
}
