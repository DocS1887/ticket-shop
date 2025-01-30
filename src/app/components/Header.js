"use client";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import Navigation from "./Navigation";
import Image from "next/image";
import konzert from "../images/konzert.png";
import logo from "../images/logo_neu.png";
import Link from "next/link";
import { supabase } from "@/app/lib/superbase";

export default function Header() {
  const { user, userData } = useAuth();
  const userRole = userData.userRole;

  const [showOptions, setShowOptions] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Optional: Hier können Sie zur Login-Seite navigieren
      window.location.href = "../login";
    } catch (error) {
      console.error("Fehler beim Logout:", error.message);
    }
  };

  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  return (
    <>
      <div className="bg-header">
        <div className="flex items-center justify-center w-full p-6 ">
          <div className="ml-auto">
            {!user ? (
              <Link href="../login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="white"
                >
                  <title id="title-id">Login</title>
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                </svg>
              </Link>
            ) : (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block relative cursor-pointer"
              >
                <h4 className="text-foreground-light">
                  Hallo {userData.firstname}{" "}
                </h4>
                {showOptions && (
                  <div
                    className="absolute justify-center w-52 bg-white opacity-95 border border-foreground p-4 left-[-8rem] rounded
                                                lg:w-48 lg:top-full lg:left-[-8rem] lg:p-2"
                  >
                    {user && userRole === "admin" && (
                      <>
                        <Link
                          href="/admin/dashboard/"
                          className="lg:hover:text-accent"
                        >
                          <h5>Admin-Dashboard</h5>
                        </Link>
                        <Link
                          href="/shoppingCard"
                          className="lg:hover:text-accent"
                        >
                          <h5>Warenkorb</h5>
                        </Link>
                      </>
                    )}
                    {user && userRole === "user" && (
                      <>
                        <Link href="/" className="lg:hover:text-accent">
                          <h5>Übersicht</h5>
                        </Link>
                        <Link href="/" className="lg:hover:text-accent">
                          <h5>Persoenliche Daten</h5>
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      className="lg:hover:text-accent p-4 w-full text-left"
                      onClick={handleLogout}
                      onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                    >
                      <h5>abmelden</h5>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-nowrap row-auto items-center p-4 ">
          <div className="text-center md:text-start">
            <Image src={logo} alt="Logo der Seite" className="w-128 h-auto" />
          </div>
          <div className="flex align-center justify-center p-4 w-full">
            <form>
              <div className="flex align-center">
                <input
                  className="flex-1 p-2 border-2 border-white sm:rounded-l text-base h-10 focus: outline-none sm:w-128 rounded-r-none"
                  type="text"
                  placeholder="Suche nach Events"
                />
                <button className="py-2 px-4 h-10 border-l-0 bg-white text-xs cursor-pointer rounded-r-md focus:outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                  >
                    <title id="title-id">Suche</title>
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
        <Image
          src={konzert}
          alt={"banner-image"}
          className="hidden md:block w-full h-96"
        />
      </div>
      <div>
        <Navigation />
      </div>
    </>
  );
}
