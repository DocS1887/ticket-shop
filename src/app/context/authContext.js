
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/app/lib/superbase';

// AuthContext erstellen
const AuthContext = createContext({});

// AuthProvider für die globale Nutzung
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    firstname: null,
    lastname: null,
    birthday: null,
    street: null,
    housenumber: null,
    zipcode: null,
    city: null,
    country: null,
    userRole: null,
    // Füge hier alle anderen Felder hinzu, die du brauchst
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        // Benutzerdetails aus der Tabelle `users` holen
        getUserDetails(session.user.id).then((userData) => {
          if (userData) {
            setUserData(userData);
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserDetails(session.user.id).then((userData) => {
          if (userData) {
            setUserData(userData);
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserDetails = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('firstname, lastname, birthday, street, zipcode, city, country, userRole')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error.message);
      return null;
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Benutzer-Hook für einfachen Zugriff
export const useAuth = () => {
  return useContext(AuthContext);
};
