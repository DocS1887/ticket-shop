
'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/app/login/LoginForm';
import RegisterForm from '@/app/login/RegisterForm';
import { supabase } from '@/app/lib/superbase';

export default function AuthContainer() {
  const [activeTab, setActiveTab] = useState('login');
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Aktuelle Session abrufen
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Auth-Status Änderungen überwachen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-start justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 mt-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            type="button"
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'login'
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('login')}
          >
            Anmelden
          </button>
          <button
            type="button"
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'register'
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('register')}
          >
            Registrieren
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
