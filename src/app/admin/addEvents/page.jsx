"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/superbase";
import Button from "@/app/components/Button";
import { useAuth } from "@/app/context/authContext";
import { useEventContext } from "@/app/context/eventContext";

export default function AddEvents() {
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isHighlight, setIsHighlight] = useState(false);
  const [isHomepage, setIsHomepage] = useState(false);
  const [categories, setCategories] = useState([]); // State für Kategorien
  const [priceClasses, setPriceClasses] = useState([]); // State für Preisklassen
  const [selectedCategory, setSelectedCategory] = useState(""); // Ausgewählte Kategorie
  const [selectedPriceClasses, setSelectedPriceClasses] = useState([
    { id: "", priceClassId: "", price: "", available_tickets: "" },
  ]); // Ausgewählte Preisklassen
  const [image, setImage] = useState(null); // Bild-Datei
  const [imageUrl, setImageUrl] = useState(""); // Bild-URL
  const [uploading, setUploading] = useState(false); // Upload-Status

  const { userData } = useAuth();
  const { refreshEvents } = useEventContext();

  // Kategorien und Preisklassen beim Laden der Komponente abrufen
  useEffect(() => {
    fetchCategories();
    fetchPriceClasses();
  }, []);

  // Funktion zum Abrufen der Kategorien
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("eventcategories").select("*");

    if (error) {
      setError(error.message);
    } else {
      setCategories(data);
    }
  };

  // Funktion zum Abrufen der Preisklassen
  const fetchPriceClasses = async () => {
    const { data, error } = await supabase.from("priceclasses").select("*");

    if (error) {
      setError(error.message);
    } else {
      setPriceClasses(data);
    }
  };

  // Funktion zum hochladen des Bildes
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.lenght === 0) {
        throw new Error("Bitte wählen Sie ein Bild aus.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-image")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("event-image").getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Funktion zum Speichern des Events
  const saveData = async (e) => {
    e.preventDefault();

    if (userData.userRole === "admin") {
      try {
        // Event speichern
        const { data: newEvent, error: eventError } = await supabase
          .from("events")
          .insert({
            name,
            description,
            date,
            time,
            location,
            is_highlight: isHighlight,
            is_homepage: isHomepage,
            eventcategories_id: selectedCategory,
            image_url: imageUrl,
          })
          .select(
            `
            id,
            name,
            description,
            date,
            time,
            location,
            eventcategories (id, name)
          `,
          )
          .single();

        if (eventError) {
          setError(eventError.message);
          return;
        }

        // Preisklassen in event_price speichern
        for (const pc of selectedPriceClasses) {
          const { error: priceError } = await supabase
            .from("event_price")
            .insert({
              event_id: newEvent.id,
              priceclass_id: pc.priceClassId, // Korrigierter Spaltenname
              price: parseFloat(pc.price),
              available_tickets: parseInt(pc.availableTickets),
            });

          if (priceError) {
            console.error("Price Error:", priceError);
            setError(priceError.message);
            return;
          }
        }

        alert("Veranstaltung erfolgreich gespeichert");
        // Reset der Formulardaten
        setName("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setIsHighlight(false);
        setIsHomepage(false);
        setSelectedCategory("");
        setSelectedPriceClasses([
          { id: "", priceClassId: "", price: "", availableTickets: "" },
        ]);
        setImageUrl(""); // Setzt die Bild-URL zurück
        setImage(null); // Setzt das Bild-Objekt zurück
        refreshEvents();
      } catch (error) {
        console.error("General Error:", error);
        setError(error.message);
      }
    }
  };

  // Funktion zum Hinzufügen eines neuen Dropdown-Menüs für Preisklassen
  const addPriceClassDropdown = () => {
    setSelectedPriceClasses((prev) => [
      ...prev,
      { id: Date.now(), priceClassId: "", price: "", available_tickets: "" }, // Eindeutige ID für jedes Dropdown
    ]);
  };

  // Funktion zum Entfernen eines Dropdown-Menüs für Preisklassen
  const removePriceClassDropdown = (id) => {
    setSelectedPriceClasses((prev) => prev.filter((pc) => pc.id !== id));
  };

  // Funktion zum Aktualisieren der ausgewählten Preisklasse in einem Dropdown
  const handlePriceClassChange = (id, priceClassId) => {
    setSelectedPriceClasses((prev) =>
      prev.map((pc) => (pc.id === id ? { ...pc, priceClassId } : pc)),
    );
  };

  const handlePriceChange = (id, price) => {
    setSelectedPriceClasses((prev) =>
      prev.map((pc) => (pc.id === id ? { ...pc, price } : pc)),
    );
  };

  const handleTicketsChange = (id, availableTickets) => {
    setSelectedPriceClasses((prev) =>
      prev.map((pc) => (pc.id === id ? { ...pc, availableTickets } : pc)),
    );
  };

  return (
    <form onSubmit={saveData} className="flex flex-col items-center p-4 w-full">
      {/* Bild Upload Container */}
      <div className="w-3/4 lg:w-1/2 mb-8">
        <label className="flex justify-start p-2 text-gray-700 mb-2">
          Event Bild:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full p-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-accent"
        />
        {uploading && <p className="mt-2">Uploading...</p>}
      </div>

      {/* Bildvorschau */}
      {imageUrl && (
        <div className="w-3/4 lg:w-1/2 mb-8">
          <img
            src={imageUrl}
            alt="Event preview"
            className="max-h-[300px] object-contain rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="flex flex-col items-center w-full">
        {/* Name */}
        <div className="lg:flex lg:flex-row lg:items-center w-3/4 lg:w-1/2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Veranstaltung"
            className="w-full h-10 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
            required
          />
        </div>

        {/* Beschreibung */}
        <div className="lg:flex lg:flex-row lg:items-center w-3/4 lg:w-1/2 mb-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
            className="w-full h-10 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
            required
          />
        </div>

        {/* Ort */}
        <div className="lg:flex lg:flex-row lg:items-center w-3/4 lg:w-1/2 mb-8">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ort"
            className="w-full h-10 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
            required
          />
        </div>

        <div className="flex flex-row w-96 mb-8">
          {/* Datum */}
          <div className="w-full px-3 mb-4">
            <div className="flex justify-start p-2">Datum:</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
              required
            />
          </div>

          {/* Uhrzeit */}
          <div className="w-full md:w-2/3 px-3 mb-4">
            <div className="flex justify-start p-2">Uhrzeit:</div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Uhrzeit"
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
              required
            />
          </div>
        </div>

        {/* Kategorie Dropdown */}
        <div className="lg:flex lg:flex-row lg:items-center w-3/4 lg:w-1/2 mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
            focus:outline-none focus:border-accent"
            required
          >
            <option value="">Kategorie auswählen</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="max-w-2xl mx-auto p-6">
          <div className="space-y-4">
            {selectedPriceClasses.map((pc) => (
              <div
                key={pc.id}
                className=" flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200"
              >
                {/* Preisklasse Dropdown */}
                <select
                  value={pc.priceClassId}
                  onChange={(e) =>
                    handlePriceClassChange(pc.id, e.target.value)
                  }
                  className="h-10 flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                  focus:outline-none focus:border-accent"
                >
                  <option value="">Preisklasse auswählen</option>
                  {priceClasses.map((priceClass) => (
                    <option key={priceClass.id} value={priceClass.id}>
                      {priceClass.name}
                    </option>
                  ))}
                </select>

                {/* Preis Input */}
                <input
                  type="number"
                  value={pc.price}
                  onChange={(e) => handlePriceChange(pc.id, e.target.value)}
                  placeholder="Preis €"
                  className="h-10 w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                  focus:outline-none focus:border-accent
                             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                             [&::-webkit-inner-spin-button]:appearance-none"
                  step="0.01"
                  min="0"
                  required
                />

                {/* Tickets Input */}
                <input
                  type="number"
                  value={pc.availableTickets}
                  onChange={(e) => handleTicketsChange(pc.id, e.target.value)}
                  placeholder="Tickets"
                  className="h-10 w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                  focus:outline-none focus:border-accent                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  required
                />

                {/* Entfernen Button */}
                {pc.id !== selectedPriceClasses[0].id && (
                  <button
                    type="button"
                    onClick={() => removePriceClassDropdown(pc.id)}
                    className="px-4 py-2.5 bg-red-500 text-white rounded-lg
                               hover:bg-red-600 active:bg-red-700
                               transition-colors duration-200 ease-in-out"
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            {/* Hinzufügen Button */}
            <button
              type="button"
              onClick={addPriceClassDropdown}
              className="w-full mt-4 px-4 py-3 bg-green-500 text-white rounded-lg
                         hover:bg-green-600 active:bg-green-700
                         transition-colors duration-200 ease-in-out
                         flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Weitere Preisklasse hinzufügen
            </button>
          </div>
        </div>

        {/* Highlight Checkbox */}
        <div className="w-full px-3 mt-8 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isHighlight"
              checked={isHighlight}
              onChange={(e) => setIsHighlight(e.target.checked)}
              className="h-4 w-4 text-accent focus:ring-accent border-accent rounded"
            />
            <label htmlFor="isHighlight" className="text-foreground">
              Als Highlight anzeigen
            </label>
          </div>
        </div>

        {/* Homepage Checkbox */}
        <div className="w-full px-3 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isHighlight"
              checked={isHomepage}
              onChange={(e) => setIsHomepage(e.target.checked)}
              className="h-4 w-4 text-accent focus:ring-accent border-accent rounded"
            />
            <label htmlFor="isHomepage" className="text-foreground">
              Auf Startseite anzeigen
            </label>
          </div>
        </div>
      </div>

      {/* Fehlermeldung */}
      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Speichern Button */}
      <div className="px-3">
        <Button type="submit" text="Speichern" />
      </div>
    </form>
  );
}
