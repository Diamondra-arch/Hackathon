import React, { useState } from 'react';
import { verifyFact } from '../services/api';

export default function FactCheck() {
  const [claimText, setClaimText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Appel de l'API backend via api.js
      const data = await verifyFact(claimText);
      setResult(data);
    } catch (err) {
      setError("Impossible d'effectuer la vérification. Vérifiez le backend et Ollama.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Vérification de faits (Fact-Checking)
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Affirmation ou rumeur à vérifier
          </label>
          <textarea
            rows="3"
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Exemple : L'eau salée guérit les maux de gorge instantanément..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !claimText.trim()}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Recherche web et analyse Ollama en cours..." : "Vérifier la déclaration"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Affirmation analysée :
            </span>
            <p className="text-lg font-medium text-gray-900 mt-1">"{result.claim}"</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-md font-bold text-gray-800 mb-2">Verdict & Analyse IA :</h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-white p-4 rounded border border-gray-100">
              {result.analysis}
            </div>
          </div>

          {result.sources && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">
                Consulter les sources web utilisées
              </summary>
              <pre className="mt-2 text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                {result.sources}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}