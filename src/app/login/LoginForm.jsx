
'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/superbase';
import Button from "@/app/components/Button"

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
      return;
    }

    // Erfolgreiche Anmeldung
    window.location.href = '../admin/dashboard'; // oder wohin auch immer Sie nach dem Login navigieren möchten
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="flex flex-wrap -mx-3">
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
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="px-3">
        <Button
          type="submit"
          text="Anmelden"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        />
      </div>
    </form>
  );
} 
