import { useCallback, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import MapBox from "./MapBox";
import { MapPin } from "lucide-react";

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
  const [showMap, setShowMap] = useState(false);

  const handleSearchResult = useCallback(
    (result: { features: string | any[] }) => {
      if (result && result.features && result.features.length > 0) {
        setShowMap(false);
        const selectedFeature = result.features[0];
        const { properties, geometry } = selectedFeature;
        const [lng, lat] = geometry.coordinates;

        setSelectedPlace(properties.name);

        setFieldValue("place", properties.name);
        setFieldValue("lat", lat);
        setFieldValue("long", lng);
      }
    },
    [setFieldValue]
  );

  let cleanPlace;
  if (selectedPlace !== undefined) {
    cleanPlace = selectedPlace.replace(/[^\w\s]/gi, "");
  } else {
    cleanPlace = undefined;
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="place">Event Location</Label>
      <SearchBox
        value={selectedPlace}
        theme={{
          variables: {
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            fontFamily: "inherit",
            lineHeight: "1.5",
            colorText: "var(--color-text)",
          },
        }}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
        onChange={
          (value) => {
            setSelectedPlace(value);
            setFieldValue("place", value);
          }
        }
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
      {selectedPlace && lat && long && (
        <Button variant="ghost" onClick={() => setShowMap(!showMap)}>
          {/* Map icon */}
          <MapPin className="h-4 w-4 mr-2" />
          {showMap ? "Hide map" : "Show map"}
        </Button>
      )}
      {showMap && (
        <div className="mt-4 h-[200px] w-full bg-muted">
          <MapBox
            locations={[
              {
                lat: lat || 0,
                lng: long || 0,
                place: selectedPlace || "",
                price: 0,
                id: "",
              },
            ]}
            hoveredLocation={null}
            mode="event"
          />
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
