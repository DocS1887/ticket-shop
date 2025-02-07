"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useEventContext } from "./eventContext";

const TimerContext = createContext();

const RESERVATION_TIME = 15 * 60; // 15 Minuten in Sekunden

export function TimerProvider({ children }) {
  const [reservations, setReservations] = useState({});
  const { supabase, refreshEvents } = useEventContext();

  // Laden der Reservierungen aus localStorage beim Start
  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      const parsed = JSON.parse(savedReservations);
      // Prüfe ob die Reservierungen noch gültig sind
      const now = Date.now();
      const valid = Object.entries(parsed).reduce((acc, [id, reservation]) => {
        if (reservation.endTime > now) {
          acc[id] = reservation;
        }
        return acc;
      }, {});
      setReservations(valid);
    }
  }, []);

  // Speichern der Reservierungen in localStorage bei Änderungen
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  // Handler für abgelaufene Reservierungen
  const handleExpiredReservation = useCallback(
    async (reservationId) => {
      if (!reservationId) {
        console.error("Versuch eine Reservierung ohne ID freizugeben");
        return;
      }

      try {
        console.log("Versuche Reservierung freizugeben:", reservationId);

        const { data, error } = await supabase.rpc("release_expired_tickets", {
          p_reservation_id: Number(reservationId),
        });

        if (error) {
          console.error("Fehler beim Freigeben der Reservierung:", error);
          throw error;
        }

        if (data?.success) {
          console.log("Reservierung erfolgreich freigegeben:", reservationId);
          await refreshEvents();
        } else {
          console.warn(
            "Reservierung konnte nicht freigegeben werden:",
            data?.message,
          );
        }
      } catch (error) {
        console.error("Fehler bei der Freigabe der Reservierung:", error);
      } finally {
        setReservations((prev) => {
          const updated = { ...prev };
          delete updated[reservationId];
          return updated;
        });
      }
    },
    [supabase, refreshEvents],
  );

  // Timer-Update-Logik
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setReservations((prev) => {
        const updated = { ...prev };
        let hasExpired = false;

        Object.entries(updated).forEach(([id, reservation]) => {
          if (now >= reservation.endTime) {
            console.log(
              "Reservierung abgelaufen:",
              id,
              reservation.numberOfTickets,
            );
            delete updated[id];
            hasExpired = true;
            // Verwende setTimeout um setState-Konflikte zu vermeiden
            setTimeout(() => handleExpiredReservation(id), 0);
          } else {
            // Aktualisiere die verbleibende Zeit
            updated[id] = {
              ...reservation,
              timeLeft: Math.ceil((reservation.endTime - now) / 1000),
            };
          }
        });

        return updated;
      });
    }, 1000);

    // Cleanup beim Unmount
    return () => clearInterval(interval);
  }, [handleExpiredReservation]);

  // Cleanup-Funktion für abgelaufene Reservierungen
  useEffect(() => {
    const cleanup = () => {
      const saved = localStorage.getItem("reservations");
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const valid = Object.entries(parsed).reduce(
          (acc, [id, reservation]) => {
            if (reservation.endTime > now) {
              acc[id] = reservation;
            }
            return acc;
          },
          {},
        );
        localStorage.setItem("reservations", JSON.stringify(valid));
      }
    };

    window.addEventListener("beforeunload", cleanup);
    return () => window.removeEventListener("beforeunload", cleanup);
  }, []);

  // Neue Reservierung hinzufügen
  const addReservation = useCallback((reservationId, reservationDetails) => {
    if (!reservationId) {
      console.error("Versuch eine Reservierung ohne ID hinzuzufügen");
      return;
    }

    console.log("Neue Reservierung hinzufügen:", {
      reservationId,
      ...reservationDetails,
    });

    const endTime = Date.now() + RESERVATION_TIME * 1000;

    setReservations((prev) => ({
      ...prev,
      [reservationId]: {
        endTime,
        timeLeft: RESERVATION_TIME,
        id: reservationId,
        ...reservationDetails, // Alle Event-Details
      },
    }));
  }, []);

  // Manuelle Entfernung einer Reservierung
  const removeReservation = useCallback((reservationId) => {
    if (!reservationId) {
      console.error("Versuch eine Reservierung ohne ID zu entfernen");
      return;
    }

    console.log("Reservierung manuell entfernen:", reservationId);
    setReservations((prev) => {
      const updated = { ...prev };
      delete updated[reservationId];
      return updated;
    });
  }, []);

  // Context-Wert
  const value = {
    reservations,
    addReservation,
    removeReservation,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

// Hook für den Zugriff auf den Timer-Context
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error(
      "useTimer muss innerhalb eines TimerProviders verwendet werden",
    );
  }
  return context;
}
