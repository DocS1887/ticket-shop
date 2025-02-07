"use client";
import { useTimer } from "@/app/context/timerContext";
import ReservationTimer from "./ReservationTimer";

export default function OrderSummary({ reservationId, compact = false }) {
  const { reservations } = useTimer();
  const reservation = reservations[reservationId];

  if (!reservation) return null;

  const isReservationAlmostExpired = reservation.timeLeft < 300; // 5 Minuten

  return (
    <div className={`${compact ? "text-sm" : ""}`}>
      {/* Timer */}
      <div
        className={`mb-4 ${isReservationAlmostExpired ? "animate-pulse" : ""}`}
      >
        <ReservationTimer reservationId={reservationId} />
        {isReservationAlmostExpired && (
          <p className="text-red-600 text-sm mt-1">
            Achtung: Diese Reservierung läuft bald ab!
          </p>
        )}
      </div>

      {/* Event Name */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{reservation.eventName}</h3>
      </div>

      {/* Ticket Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Kategorie:</span>
          <span>{reservation.priceCategory}</span>
        </div>
        <div className="flex justify-between">
          <span>Anzahl Tickets:</span>
          <span>{reservation.numberOfTickets}</span>
        </div>
        <div className="flex justify-between">
          <span>Preis pro Ticket:</span>
          <span>{reservation.pricePerTicket?.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Zwischensumme:</span>
          <span>{reservation.totalPrice} €</span>
        </div>
      </div>
    </div>
  );
}
