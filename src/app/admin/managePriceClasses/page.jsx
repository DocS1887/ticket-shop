'use client'

import { supabase } from "@/app/lib/superbase";
import { useAuth } from "@/app/context/authContext";
import { useState, useEffect } from "react";
import Button from "@/app/components/Button";

export default function ManagePriceClasses() {

  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [priceClass, setPriceClass] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();

  useEffect(() => {
    fetchPriceClasses();
  }, []);

    const fetchPriceClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('priceclasses')
      .select('*');

    if (error) {
      setError(error.message);
    } else {
      setPriceClass(data);
    }
    setLoading(false);
  };

    const savePriceClass = async (e) => {
    e.preventDefault();

    if (userData.userRole === "admin") {
      const { data: newPriceClass, error: priceClassError } = await supabase
        .from('priceclasses')
        .insert({
          name,
        })
        .select()
        .single();

      if (priceClassError) {
        setError(priceClassError.message);
      } else {
        alert('Preisklasse erfolgreich gespeichert');
        setName('');
        fetchPriceClasses();
      }
    }
  };

  const deletePriceClass = async (id) => {
    if (userData.userRole === "admin") {
      const { error } = await supabase
        .from('priceclasses')
        .delete()
        .eq('id', id);

      if (error) {
        setError(error.message);
      } else {
        alert('Preisklasse erfolgreich gelöscht');
        fetchPriceClasses();
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Kategorien verwalten</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={savePriceClass} className="space-y-6">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Preisklasse hinzufügen"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="px-3">
            <Button
              type="submit"
              text="Speichern"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            />
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-center mt-6">Lade Preisklassen...</p>
      ) : (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Vorhandene Preisklassen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceClass.map((priceclass) => (
              <div key={priceclass.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <span className="text-lg">{priceclass.name}</span>
                <button
                  onClick={() => deletePriceClass(priceclass.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Löschen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
