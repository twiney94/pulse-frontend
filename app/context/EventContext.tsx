// /context/EventContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import type { EventDetails } from "@/app/types/d";

interface EventContextProps {
  eventDetails: EventDetails | null;
  setEventDetails: (details: EventDetails | null) => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};
