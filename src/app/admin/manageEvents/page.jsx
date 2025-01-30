"use client";
import { useState } from "react";
import Link from "next/link";
import { useEventContext } from "@/app/context/eventContext";
import { useRouter } from "next/navigation";
import { formatDate, formatTime } from "@/app/components/DateFormatter";

export default function ManageEvents() {
  const { events, loading, supabase, refreshEvents } = useEventContext();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filterfunktion für die Suche
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Löschfunktion
  const handleDelete = async (eventId) => {
    if (window.confirm("Möchten Sie dieses Event wirklich löschen?")) {
      try {
        // Erst die abhängigen event_price Einträge löschen
        const { error: priceError } = await supabase
          .from("event_price")
          .delete()
          .eq("event_id", eventId);

        if (priceError) throw priceError;

        // Dann das Event selbst löschen
        const { error } = await supabase
          .from("events")
          .delete()
          .eq("id", eventId);

        if (error) throw error;

        // Liste aktualisieren
        await refreshEvents();
        alert("Event erfolgreich gelöscht");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Fehler beim Löschen des Events");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events verwalten</h2>
        <Link
          href="/admin/addEvents"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Neues Event erstellen
        </Link>
      </div>

      {/* Suchfeld */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Event suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Events Liste */}
      <div className="space-y-4">
        {loading ? (
          <p>Lade Events...</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <h3 className="font-bold">{event.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(event.date)} | {formatTime(event.time)} |{" "}
                  {event.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/editEvent/${event.id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
