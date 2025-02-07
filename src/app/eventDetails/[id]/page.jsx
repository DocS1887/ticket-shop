"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useEventContext } from "@/app/context/eventContext";
import { useAuth } from "@/app/context/authContext";
import { useRouter, useParams } from "next/navigation";
import { formatDate, formatTime } from "@/app/components/DateFormatter";
import { useTimer } from "@/app/context/timerContext";

export default function EventDetailPage() {
  // Contexts und Router
  const { events, loading, supabase, refreshEvents } = useEventContext();
  const { addReservation, removeReservation, reservations } = useTimer();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const eventId = parseInt(params.id);

  // State Management
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1); // Start mit 1 statt 2
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState("0.00"); // Initialisiere mit String '0.00'

  // Lade Event-Details beim ersten Render
  useEffect(() => {
    if (events.length > 0) {
      const currentEvent = events.find((e) => e.id === eventId); // Verwende eventId statt params.id

      setEvent(currentEvent);
    }
  }, [events, eventId]);

  // Effekt für Preisberechnung bei Änderungen
  useEffect(() => {
    if (selectedPrice) {
      updateTotalPrice(numberOfTickets);
    }
  }, [selectedPrice, numberOfTickets]);

  // Ticket Anzahl Handlers
  const handleCountDown = () => {
    if (numberOfTickets > 1) {
      const newCount = numberOfTickets - 1;
      setNumberOfTickets(newCount);
      updateTotalPrice(newCount);
    }
  };

  const handleCountUp = () => {
    const newCount = numberOfTickets + 1;
    setNumberOfTickets(newCount);
    updateTotalPrice(newCount);
  };

  // Berechne Gesamtpreis
  const updateTotalPrice = (tickets, price = selectedPrice) => {
    if (price) {
      const newTotal = (tickets * price.price).toFixed(2);
      setTotalPrice(newTotal);
    }
  };

  // Handler für Preiskategorie-Auswahl
  const handlePriceCategorySelect = (priceCategory) => {
    setSelectedPrice(priceCategory);
    updateTotalPrice(numberOfTickets, priceCategory);
  };

  // Ticket Reservierung
  const handleReserveTickets = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedPrice) {
      alert("Bitte wählen Sie eine Preiskategorie aus.");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("create_ticket_reservation", {
        // Neuer Funktionsname
        p_user_id: user.id,
        p_event_id: event.id,
        p_price_category_id: selectedPrice.priceclasses.id,
        p_number_of_tickets: numberOfTickets,
        p_total_price: parseFloat(totalPrice),
      });

      if (error) throw error;

      if (!data.success) {
        alert(data.message);
        return;
      }

      console.log("Reservierung erstellt:", data);

      if (!data.reservation_id) {
        throw new Error("Keine Reservierungs-ID erhalten");
      }

      if (data.success) {
        addReservation(data.reservation_id, {
          numberOfTickets,
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          eventImage: event.image_url,
          priceCategory: selectedPrice.priceclasses.name,
          pricePerTicket: selectedPrice.price,
          totalPrice: totalPrice,
        });
      }

      await refreshEvents();

      router.push("/shoppingCart");
    } catch (error) {
      console.error("Reservierungsfehler:", error);
      alert(
        "Fehler bei der Reservierung. Bitte versuchen Sie es später erneut.",
      );
    }
  };

  if (loading || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Header mit Hauptinformationen */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Ort:</span>
                {event.location}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Datum:</span>
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Zeit:</span>
                {formatTime(event.time)}
              </div>
              <div className="mb-4">
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Event Bild */}
          {event.image_url && (
            <div className="relative h-64 md:h-auto">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Ticket Auswahl Bereich */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Ticket Auswahl</h2>

        {/* Anzahl der Tickets */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Anzahl Tickets</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCountDown}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              -
            </button>
            <span className="text-xl">{numberOfTickets}</span>
            <button
              onClick={handleCountUp}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Preiskategorien */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Preiskategorien</h3>
          <div className="space-y-4">
            {event.event_price?.map((price) => (
              <div
                key={price.priceclasses.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{price.priceclasses.name}</p>
                  {/* <p className="text-sm text-gray-600">
                    Verfügbare Tickets: {price.available_tickets}
                  </p> */}
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold">{price.price.toFixed(2)} €</p>
                  <input
                    type="radio"
                    name="priceCategory"
                    checked={
                      selectedPrice?.priceclasses?.id === price.priceclasses.id
                    }
                    onChange={() => handlePriceCategorySelect(price)}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservierungsbutton */}
        <div className="flex flex-col items-end">
          <div className="flex justify-end p-4">
            <button
              className="p-4 bg-header text-foreground-light font-bold cursor-pointer min-w-44 rounded-lg"
              onClick={handleReserveTickets}
            >
              <div className="flex flex-row gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="white"
                >
                  <title id="title-id">shoppimgCart</title>
                  <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                </svg>
                {numberOfTickets} Tickets, {totalPrice} €
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
