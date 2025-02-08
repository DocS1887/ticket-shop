"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTimer } from "@/app/context/timerContext";
import OrderSummary from "@/app/components/OrderSummary";
import { useAuth } from "@/app/context/authContext";
import { useState, useEffect } from "react";
import ReservationTimer from "@/app/components/ReservationTimer";

export default function Payment() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const searchParams = useSearchParams();
  const { reservations } = useTimer();

  // Hole alle Reservierungs-IDs aus den URL-Parametern
  const reservationIds = searchParams.get("reservationIds")?.split(",") || [];

  // Prüfe ob alle Reservierungen noch gültig sind
  const [allReservationsValid, setAllReservationsValid] = useState(true);

  useEffect(() => {
    const valid = reservationIds.every((id) => reservations[id]?.timeLeft > 0);
    setAllReservationsValid(valid);

    if (!valid) {
      router.push("/shoppingCart");
    }
  }, [reservationIds, reservations, router]);

  // Berechne Gesamtsumme
  const totalAmount = reservationIds
    .reduce((sum, id) => sum + Number(reservations[id]?.totalPrice || 0), 0)
    .toFixed(2);

  // Handler für den Klick auf "Weiter zur Zahlung"
  const handlePayment = async () => {
    try {
      router.push("/orders/confirmation");
    } catch (error) {
      console.error("Fehler beim Weiterleiten zur Zahlung:", error);
    }
  };

  if (!allReservationsValid) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formular Bereich */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Zahlungsinformationen</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6">
              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">Bankeinzug</p>
                  <p className="text-sm text-gray-400 pt-2">
                    Bequem vom Konto abbuchen lassen
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>

              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">
                    Sofortüberweisung
                  </p>
                  <p className="text-sm text-gray-400 pt-2">
                    Direkt mit Onlineueberweisung bezahlen.
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>

              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">Klarna</p>
                  <p className="text-sm text-gray-400 pt-2">
                    Auf Rechnung in 30 Tagen bezahlen.
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>

              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">
                    Apple Pay | Google Pay
                  </p>
                  <p className="text-sm text-gray-400 pt-2">
                    Zahlung mit Google oder Apple Pay.
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">PayPal</p>
                  <p className="text-sm text-gray-400 pt-2">
                    Einfach, schnell und sicher mit PayPal bezahlen.
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>

              <div className="flex items-center p-2 place-content-between border border-accent rounded-lg">
                <div>
                  <p className="font-bold flex items-start">giropay</p>
                  <p className="text-sm text-gray-400 pt-2">
                    Das Online-Bezahlverfahren deiner Bank.
                  </p>
                </div>
                <input type="radio" name="payment" className="w-4 h-4" />
              </div>
            </form>
          </div>
        </div>

        {/* Bestellübersicht */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bestellübersicht</h2>
            <div className="space-y-4">
              {/* Einzelne Reservierungen */}
              {reservationIds.map((id) => {
                const reservation = reservations[id];
                if (!reservation) return null; // Vorbeugung gegen undefined reservations
                return (
                  <div key={id} className="border-b pb-4">
                    {/* Timer anzeigen */}
                    <OrderSummary reservationId={id} />
                  </div>
                );
              })}

              {/* Gesamtsumme */}
              <div className="pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Gesamtsumme:</span>
                  <span>{totalAmount} €</span>
                </div>
                <p className="text-sm text-gray-600 text-right">inkl. MwSt</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handlePayment}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
          transition-colors duration-200 focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2"
            >
              kostenpflichtig bestellen
            </button>
            <button
              onClick={() => router.push("/shoppingCart")}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50
          transition-colors duration-200 focus:outline-none focus:ring-2
          focus:ring-gray-500 focus:ring-offset-2"
            >
              Zurück zum Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
