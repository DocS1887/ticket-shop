"use client";
import { useTimer } from "@/app/context/timerContext";

export default function ReservationTimer({ reservationId }) {
  const { reservations } = useTimer();
  const reservation = reservations[reservationId];

  if (!reservation) return null;

  const minutes = Math.floor(reservation.timeLeft / 60);
  const seconds = reservation.timeLeft % 60;

  return (
    <div className="text-sm text-gray-600">
      Reservierung läuft ab in: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
