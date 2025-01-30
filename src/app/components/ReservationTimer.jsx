"use client";
import { useTimer } from "@/app/context/timerContext";
import { useState, useEffect } from "react";

export default function ReservationTimer({ reservationId }) {
  const { reservations } = useTimer();
  const reservation = reservations[reservationId];
  const [timerColor, setTimerColor] = useState("text-gray-600");

  if (!reservation) return null;

  const minutes = Math.floor(reservation.timeLeft / 60);
  const seconds = reservation.timeLeft % 60;

  // Farbe basierend auf der verbleibenden Zeit setzen
  useEffect(() => {
    if (minutes < 5) {
      setTimerColor(
        "font-bold animate-pulse bg-red-400 border-red-700 rounded-lg p-4",
      );
    } else if (minutes < 10) {
      setTimerColor(
        "font-semibold font-bold bg-yellow-400 border-yellow-700 rounded-lg p-4",
      );
    } else {
      setTimerColor("bg-green-400 border border-green-700 rounded-xl p-4 ");
    }
  }, [minutes]);

  return (
    <div
      className={`text-lg text-foreground-light ${timerColor} transition-colors duration-300 p-4 rounded-full`}
    >
      Reservierung läuft ab in:{" "}
      <span className="font-mono">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
