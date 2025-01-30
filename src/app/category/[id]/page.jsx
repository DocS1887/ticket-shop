"use client";

import { useEventContext } from "../../context/eventContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button";
import { formatDate, formatTime } from "@/app/components/DateFormatter";

export default function CategoryPage() {
  const { events, loading } = useEventContext();
  const params = useParams();

  if (loading) return <div>Loading...</div>;

  // Filtere Events für diese Kategorie
  const categoryEvents = events.filter(
    (event) => event.eventcategories?.id === parseInt(params.id),
  );

  // Hole den Kategorienamen vom ersten Event
  const categoryName =
    categoryEvents[0]?.eventcategories?.name || "Kategorie nicht gefunden";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      {categoryEvents.map((event) => (
        <div
          key={event.id}
          className="grid grid-cols-5 gap-4 border border-gray-300 rounded-lg shadow-md bg-white p-4 mb-4"
        >
          <div className="item1 col-span-1 row-span-3 hidden lg:block">
            {event.image_url && (
              <Image
                src={event.image_url}
                alt={event.name}
                width={300}
                height={200}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>

          <div className="item2 col-span-5 lg:col-span-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{event.name}</h3>
            </div>

            <div className="text-center">
              <div className="mt-4">{event.description}</div>
            </div>

            <div className="col-span-4 flex flex-col items-center lg:flex-row lg:justify-between lg:items-center p-4">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex gap-1 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2222a5"
                  >
                    <title id="location-id">Location</title>
                    <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                  </svg>
                  <div className="text-center lg:text-left">
                    <strong>{event.location}</strong>
                  </div>
                </div>

                <div className="flex gap-1 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2222a5"
                  >
                    <title id="date-id">Date</title>
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                  </svg>
                  <span className="hidden lg:inline">
                    {formatDate(event.date)} | {formatTime(event.time)} Uhr
                  </span>
                  <span className="lg:hidden">
                    <div>{event.date}</div>
                    <div>{event.time} Uhr</div>
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl">
                  ab €{" "}
                  {Math.min(
                    ...event.event_price.map((price) => price.price),
                  ).toFixed(2)}
                </div>
                <Link href={`/eventDetails/${event.id}`}>
                  <Button text="Weiter" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
