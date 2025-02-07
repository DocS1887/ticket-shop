"use client";
import { useRouter } from "next/navigation";
import { useTimer } from "@/app/context/timerContext";
import OrderSummary from "@/app/components/OrderSummary";
import { formatDate, formatTime } from "@/app/components/DateFormatter";
import { useState } from "react";

export default function ShoppingCart() {
  const router = useRouter();
  const { reservations, removeReservation } = useTimer();
  const [isProcessing, setIsProcessing] = useState(false);

  // Leerer Warenkorb
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

  // Gesamtsumme berechnen
  const totalAmount = Object.values(reservations)
    .reduce((total, reservation) => total + Number(reservation.totalPrice), 0)
    .toFixed(2);

  // Handle Checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Prüfe ob alle Reservierungen noch gültig sind
      const allValid = Object.values(reservations).every(
        (reservation) => reservation.timeLeft > 0,
      );

      if (!allValid) {
        alert(
          "Eine oder mehrere Reservierungen sind abgelaufen. Bitte entfernen Sie diese aus dem Warenkorb.",
        );
        return;
      }

      // Sammle alle gültigen Reservierungen
      const validReservationIds = Object.keys(reservations);
      await router.push(
        `/orders/checkUserData?reservationIds=${validReservationIds.join(",")}`,
      );
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Remove Reservation
  const handleRemove = (reservationId) => {
    if (window.confirm("Möchten Sie diese Reservierung wirklich entfernen?")) {
      removeReservation(reservationId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Warenkorb</h1>

      {/* Reservierungen */}
      <div className="space-y-4">
        {Object.entries(reservations).map(([reservationId, reservation]) => (
          <div
            key={reservationId}
            className="relative bg-white rounded-lg shadow-lg p-6"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(reservationId)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
              aria-label="Reservierung entfernen"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Image */}
              <div className="relative h-48 md:h-full">
                {reservation.eventImage && (
                  <img
                    src={reservation.eventImage}
                    alt={reservation.eventName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Event Details mit OrderSummary */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">
                  {reservation.eventName}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Event Informationen */}
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Datum:</span>
                      {formatDate(reservation.eventDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Zeit:</span>
                      {formatTime(reservation.eventTime)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Ort:</span>
                      {reservation.eventLocation}
                    </p>
                  </div>

                  {/* Timer und Ticket Details */}
                  <div>
                    <OrderSummary reservationId={reservationId} />
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
          <p className="text-2xl font-bold">{totalAmount} €</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50
                     transition-colors duration-200 focus:outline-none focus:ring-2
                     focus:ring-gray-500 focus:ring-offset-2"
          >
            Zurück
          </button>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors
                      duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:ring-offset-2 ${
                        isProcessing
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }`}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Wird verarbeitet...
              </div>
            ) : (
              "Zur Kasse"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
