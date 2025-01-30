import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import { AuthProvider } from "./context/authContext";
import { EventProvider } from "./context/eventContext";
import { TimerProvider } from "./context/timerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ticket Booking",
  description: "Buche Tickets fuer dein Lieblings-Event",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <EventProvider>
            <TimerProvider>
              <Header />

              {children}
              <Footer />
            </TimerProvider>
          </EventProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
