"use client";
import { useTimer } from "@/app/context/timerContext";
import ReservationTimer from "./ReservationTimer";
import { formatDate, formatTime } from "./DateFormatter";

export default function OrderSummary({ reservationId }) {
  const { reservations } = useTimer();

  // Hole die spezifische Reservierung
  const currentReservation = reservations[reservationId];

  if (!currentReservation) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full">
      <div className="mb-4">
        <ReservationTimer reservationId={reservationId} />
      </div>

      <div className="space-y-3">
        {/* Event Details */}
        <h3 className="font-bold text-lg">{currentReservation.eventName}</h3>

        <div className="text-sm space-y-1 text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(currentReservation.eventDate)}
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(currentReservation.eventTime)}
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {currentReservation.eventLocation}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-sm">
            <span>Kategorie:</span>
            <span>{currentReservation.priceCategory}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Anzahl Tickets:</span>
            <span>{currentReservation.numberOfTickets}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Preis pro Ticket:</span>
            <span>{currentReservation.pricePerTicket?.toFixed(2)} €</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>Gesamtpreis:</span>
            <span>{currentReservation.totalPrice} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
