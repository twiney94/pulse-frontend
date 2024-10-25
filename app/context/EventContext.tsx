import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

interface EventContextType {
  eventDetails: any;
  setEventDetails: Dispatch<SetStateAction<any>>;
}

const EventContext = createContext<EventContextType | null>(null);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const [eventDetails, setEventDetails] = useState(null);

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
