"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/superbase.js";

// Context erstellen
const EventContext = createContext();

// Provider-Komponente
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funktion zum Abrufen der Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("events").select(`
        id,
        name,
        description,
        date,
        time,
        location,
        image_url,
        is_homepage,
        is_highlight,
        eventcategories (id, name),
        event_price (price, available_tickets, priceclasses (id, name))
      `);

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Beim Mount der Komponente die Events laden
  useEffect(() => {
    fetchEvents();
  }, []);

  const refreshEvents = () => {
    fetchEvents();
  };

  // Wert, der im Context verfügbar gemacht wird
  const value = {
    events,
    loading,
    supabase, // Supabase-Client für weitere Abfragen
    refreshEvents,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

// Hook zur einfachen Verwendung des Contexts
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
