// components/LocationPicker.tsx

import { useCallback, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";

interface LocationPickerProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  place: string;
  lat: number;  
  long: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  setFieldValue,
  place,
  lat,
  long,
}) => {
  const [selectedPlace, setSelectedPlace] = useState(place);

  const handleSearchResult = useCallback(
    (result: { features: string | any[] }) => {
      if (result && result.features && result.features.length > 0) {
        const selectedFeature = result.features[0];
        const { place_name, geometry } = selectedFeature;
        const [lng, lat] = geometry.coordinates;

        setSelectedPlace(place_name);

        setFieldValue("place", place_name);
        setFieldValue("lat", lat);
        setFieldValue("long", lng);
      }
    },
    [setFieldValue]
  );

  return (
    <div>
      <Label htmlFor="place">Event Location</Label>
      <SearchBox
        value={place}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
        onRetrieve={handleSearchResult}
        options={{
          limit: 5,
          country: "fr",
        }}
      />
      <ErrorMessage
        name="place"
        component="div"
        className="text-red-500 text-sm"
      />
      <p className="text-sm text-muted-foreground mt-1">
        Latitude: {lat}, Longitude: {long}
      </p>
    </div>
  );
};

export default LocationPicker;
