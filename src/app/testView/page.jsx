"use client";
import { useEffect } from "react";
import { useEventContext } from "../context/eventContext";
import { formatDate, formatTime } from "../components/DateFormatter";

export default function TestView() {
  const { events, loading } = useEventContext();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Alle Veranstaltungen</h1>
      <div className="grid gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p className="text-gray-600">{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Datum:</span>
                    {formatDate(event.date)}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Zeit:</span>

                    {formatTime(event.time)}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Ort:</span>
                    {event.location}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Kategorie:</span>
                    {event.eventcategories?.name}
                  </p>
                </div>
                <div key={event.id} className="border rounded-lg p-6 shadow-md">
                  {event.image_url && (
                    <div className="mb-4">
                      <img
                        src={event.image_url}
                        alt={event.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.log("Bild Ladefehler:", e);
                          console.log("Versuchte URL:", event.image_url);
                        }}
                      />
                    </div>
                  )}
                  {/* ... Rest der Event-Anzeige ... */}
                </div>

                {/* Preisklassen */}
                <div>
                  <h3 className="font-medium mb-2">Verfügbare Preisklassen:</h3>
                  <div className="space-y-2">
                    {event.event_price?.map((price) => (
                      <div
                        key={price.priceclasses?.id}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span>{price.priceclasses?.name}</span>
                        <div className="text-right">
                          <span className="font-medium">
                            {price.price.toFixed(2)} €
                          </span>
                          <p className="text-sm text-gray-600">
                            {price.available_tickets} Tickets verfügbar
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
