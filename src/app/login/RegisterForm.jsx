
'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/superbase';
import Button from "@/app/components/Button"

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [street, setStreet] = useState('');
  const [housenumber, setHousenumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const userRole = 'user';

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      console.error('Registrierungsfehler:', authError);
      return;
    }

    const { session } = data;
    if (!session) {
      console.error('Keine Session nach Registrierung verfügbar');
    } else {
      console.log('Session:', session);
      console.log('User ID:', session.user.id);
    }

    if (authError) {
      setError(authError.message);
      return;
    }

    const { user } = data;
    console.log("Benutzer-Id: ", user.id)
    if (user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email,
          firstname,
          lastname,
          birthday,
          street,
          housenumber,
          zipcode,
          city,
          country,
          userRole,
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        alert('Registrierung erfolgreich und Daten gespeichert!');
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="flex flex-wrap -mx-3">
        {/* E-Mail & Passwort */}
        <div className="w-full px-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail Adresse"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="w-full px-3 mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Name */}
        <div className="w-full md:w-1/2 px-3 mb-4">
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Vorname"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-4">
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Nachname"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Geburtstag */}
        <div className="w-full px-3 mb-4">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Adresse */}
        <div className="w-full md:w-2/3 px-3 mb-4">
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Straße"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-4">
          <input
            type="text"
            value={housenumber}
            onChange={(e) => setHousenumber(e.target.value)}
            placeholder="Nr."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-4">
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="PLZ"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-2/3 px-3 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Stadt"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="w-full px-3 mb-4">
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Land"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="px-3">
        <Button
          type="submit"
          text="Registrieren"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        />
      </div>
    </form>
  );
} 
