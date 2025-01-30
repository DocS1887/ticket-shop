"use client";
import { useTimer } from "@/app/context/timerContext";
import ReservationTimer from "@/app/components/ReservationTimer";
import { formatDate, formatTime } from "@/app/components/DateFormatter";
import OrderSummary from "@/app/components/OrderSummary";

export default function ShoppingCart() {
  const { reservations, removeReservation } = useTimer();

  if (Object.keys(reservations).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Warenkorb</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-600">Ihr Warenkorb ist leer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Warenkorb</h1>

      <div className="space-y-4">
        {Object.entries(reservations).map(([reservationId, reservation]) => (
          <div
            key={reservationId}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-end items-center mb-4">
              <OrderSummary key={reservationId} reservationId={reservationId} />
            </div>

            {/* Timer und Entfernen-Button */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => removeReservation(reservationId)}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event-Bild */}
              <div className="relative h-48 md:h-full">
                {reservation.eventImage && (
                  <img
                    src={reservation.eventImage}
                    alt={reservation.eventName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Event-Details */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-2">
                  {reservation.eventName}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Datum: </span>
                    {formatDate(reservation.eventDate)}
                  </p>
                  <p>
                    <span className="font-medium">Zeit: </span>
                    {formatTime(reservation.eventTime)}
                  </p>
                  <p>
                    <span className="font-medium">Ort: </span>
                    {reservation.eventLocation}
                  </p>
                  <p>
                    <span className="font-medium">Kategorie: </span>
                    {reservation.priceCategory}
                  </p>
                </div>

                {/* Ticket-Details */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Anzahl Tickets:</p>
                      <p className="text-lg">{reservation.numberOfTickets}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Preis pro Ticket:</p>
                      <p className="text-lg">
                        {reservation.pricePerTicket?.toFixed(2)} €
                      </p>
                      <p className="font-medium mt-2">Gesamtpreis:</p>
                      <p className="text-lg font-bold">
                        {reservation.totalPrice} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gesamtsumme und Aktionen */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">Gesamtsumme</p>
            <p className="text-sm text-gray-600">inkl. MwSt</p>
          </div>
          <p className="text-2xl font-bold">
            {Object.values(reservations)
              .reduce(
                (total, reservation) => total + Number(reservation.totalPrice),
                0,
              )
              .toFixed(2)}{" "}
            €
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Zurück
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Zur Kasse
          </button>
        </div>
      </div>
    </div>
  );
}
