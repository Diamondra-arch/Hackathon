import React, { useState } from 'react';
import { autoWriteArticle } from '../services/api';

export default function RedigerPage() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      // Appel à votre service frontend connecté à FastAPI et Ollama
      const data = await autoWriteArticle(title, "", "Web");
      setArticle(data);
    } catch (error) {
      alert("Erreur lors de la génération de l'article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rédiger un article avec Cheky IA</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le sujet ou le titre de l'actualité..." 
          className="border p-2 rounded w-full mb-2"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Recherche web et rédaction en cours..." : "Générer l'article"}
        </button>
      </form>

      {article && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h2 className="text-xl font-semibold mb-2">{article.generated_title}</h2>
          <div className="whitespace-pre-line">{article.content}</div>
        </div>
      )}
    </div>
  );
}