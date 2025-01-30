"use client";

import Link from "next/link";
import { useEventContext } from "../context/eventContext";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const { events, loading } = useEventContext();
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  // Erstelle eine Map von Kategorien mit Events
  const categoriesWithEvents = events.reduce((acc, event) => {
    if (event.eventcategories) {
      if (!acc.has(event.eventcategories.id)) {
        acc.set(event.eventcategories.id, {
          id: event.eventcategories.id,
          name: event.eventcategories.name,
          events: [],
        });
      }
      acc.get(event.eventcategories.id).events.push(event);
    }
    return acc;
  }, new Map());

  // Konvertiere Map zu Array und filtere Kategorien ohne Events
  const activeCategories = Array.from(categoriesWithEvents.values()).filter(
    (category) => category.events.length > 0,
  );

  const toggleMenu = () => {
    setShowMenu(!showMenu); // Menü ein-/ausblenden
  };

  if (loading) return null;

  return (
    <nav className="p-4 min-h-[4.1rem] flex items-center justify-between lg:justify-start bg-header">
      <div
        className="lg:hidden cursor-pointer flex flex-col"
        onClick={toggleMenu}
      >
        <span className="block h-[2px] w-6 bg-header mb-1"></span>
        <span className="block h-[2px] w-6 bg-header mb-1"></span>
        <span className="block h-[2px] w-6 bg-header"></span>
      </div>

      <ul
        className={`${
          showMenu ? "flex" : "hidden"
        } absolute top-[60px] justify-center left-0 w-full bg-white opacity-95 border border-foreground flex-col p-4 space-y-4 lg:space-y-0 lg:flex lg:flex-row lg:relative lg:bg-transparent lg:opacity-100 lg:border-0 lg:top-auto lg:left-auto lg:space-x-6 lg:p-0`}
      >
        <li>
          <Link
            href="/"
            className={`lg:text-foreground-light hover:underline lg:hover:text-accent lg:hover:decoration-4 lg:hover:underline-offset-4 ${
              pathname === "/" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Startseite
          </Link>
        </li>
        <li>
          <Link
            href="/testView"
            className={`lg:text-foreground-light hover:underline lg:hover:text-accent lg:hover:decoration-4 lg:hover:underline-offset-4 ${
              pathname === "/testView" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            TestView
          </Link>
        </li>
        {activeCategories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.id}`}
              className={`lg:text-foreground-light hover:underline lg:hover:text-accent lg:hover:decoration-4 lg:hover:underline-offset-4 ${
                pathname === `/category/${category.id}`
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
