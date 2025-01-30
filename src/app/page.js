"use client";

import { useEventContext } from "./context/eventContext";
import Image from "next/image";
import Button from "./components/Button";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { events, loading } = useEventContext();

  if (loading) return <div>Loading...</div>;

  const homepageEvents = events.filter((event) => event.is_homepage);
  const highlightEvents = events.filter((event) => event.is_highlight);

  const EventCard = ({ event }) => {
    const minPrice = Math.min(...event.event_price.map((price) => price.price));

    return (
      <div className="flex flex-col items-center w-56">
        <div className="relative w-56 h-40">
          {event.image_url && (
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              className="object-cover rounded-lg"
            />
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold truncate w-full text-center">
          {event.name}
        </h3>
        <p className="text-lg font-bold mt-1">ab € {minPrice}</p>
        <Link href={`/eventDetails/${event.id}`}>
          <Button text="Tickets" className="mt-2" />
        </Link>
      </div>
    );
  };

  const EventSection = ({ title, events }) => {
    const [startIndex, setStartIndex] = useState(0);
    const eventsToShow = events.slice(startIndex, startIndex + 5);

    const handlePrevious = () => {
      setStartIndex(Math.max(0, startIndex - 5));
    };

    const handleNext = () => {
      setStartIndex(Math.min(startIndex + 5, events.length - 5));
    };

    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
        <div className="relative">
          {startIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          <div className="flex justify-center gap-4">
            {eventsToShow.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {startIndex < events.length - 5 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-accent shadow-lg shadow-foreground p-4">
        {highlightEvents.length > 0 && (
          <EventSection title="Highlights" events={highlightEvents} />
        )}
      </div>
      <div className="p-4">
        {homepageEvents.length > 0 && (
          <EventSection
            // title="Aktuelle Veranstaltungen"
            events={homepageEvents}
          />
        )}
      </div>
    </div>
  );
}
