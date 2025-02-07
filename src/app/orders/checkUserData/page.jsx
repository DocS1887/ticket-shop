"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTimer } from "@/app/context/timerContext";
import OrderSummary from "@/app/components/OrderSummary";
import { useAuth } from "@/app/context/authContext";
import { useState, useEffect } from "react";

export default function CheckUserData() {
  const router = useRouter();
  const { user, userData, updateUserDetails } = useAuth();
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

  // Lokaler Zustand für die Formulardaten
  const [formData, setFormData] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    street: userData.street,
    housenumber: userData.housenumber,
    zipcode: userData.zipcode,
    city: userData.city,
    country: userData.country,
    email: userData.email,
  });

  // Handler für die Änderung der Formulardaten
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler fuer das speichern des userupdate
  const handlePayment = async () => {
    try {
      await updateUserDetails(user.id, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        street: formData.street,
        housenumber: formData.housenumber,
        zipcode: formData.zipcode,
        city: formData.city,
        country: formData.country,
      });
      const validReservationIds = Object.keys(reservations); // Alle Reservierungs-IDs aus dem Warenkorb
      router.push(
        `/orders/payment?reservationIds=${validReservationIds.join(",")}`,
      );
    } catch (error) {
      console.error("Fehler beim Speichern der Benutzerdaten:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formular Bereich */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Persönliche Daten</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="mx-3">
                    {/* Name */}
                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Vorname:
                      </div>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Nachname:
                      </div>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Adresse */}
                    <div className="w-full md:w-2/3 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Strasse:
                      </div>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Nr.:
                      </div>
                      <input
                        type="text"
                        name="houseNumber"
                        value={formData.housenumber}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="w-full md:w-1/3 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        PLZ:
                      </div>
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="w-full md:w-2/3 px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Stadt:
                      </div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="w-full px-3 mb-4">
                      <div className="flex justify-start p-2 text-foreground">
                        Land:
                      </div>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* E-Mail */}
                    <div className="w-full px-3 mb-4 justify-start">
                      <div className="flex justify-start p-2 text-foreground">
                        E-Mail:
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        readOnly
                      />
                    </div>
                  </div>
                </label>
              </div>
              {/* Weitere Formularfelder */}
            </form>
          </div>
        </div>

        {/* Bestellübersicht */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bestellübersicht</h2>
            <div className="space-y-4">
              {/* Einzelne Reservierungen */}
              {reservationIds.map((id) => (
                <div key={id} className="border-b pb-4">
                  <OrderSummary reservationId={id} />
                </div>
              ))}

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
              Weiter zur Zahlung
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
