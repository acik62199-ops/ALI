import React, { useState } from 'react';
import axios from 'axios';

const JokeGenerator = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('random');

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'random' 
        ? '/api/jokes/random' 
        : `/api/jokes/type/${type}`;
      const response = await axios.get(endpoint);
      setJoke(response.data);
    } catch (error) {
      console.error('Error fetching joke:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">😂 Joke Generator</h1>
      
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-white text-black"
      >
        <option value="random">Random</option>
        <option value="general">General</option>
        <option value="knock-knock">Knock Knock</option>
        <option value="programming">Programming</option>
      </select>

      <button
        onClick={fetchJoke}
        disabled={loading}
        className="w-full bg-white text-purple-600 font-bold py-2 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        {loading ? '⏳ Loading...' : '🎭 Get Joke'}
      </button>

      {joke && (
        <div className="mt-6 bg-white p-4 rounded text-black">
          <p className="font-bold text-lg mb-2">Setup:</p>
          <p className="mb-4">{joke.setup}</p>
          <p className="font-bold text-lg mb-2">Punchline:</p>
          <p className="text-lg text-purple-600">{joke.punchline}</p>
          <span className="inline-block mt-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {joke.type}
          </span>
        </div>
      )}
    </div>
  );
};

export default JokeGenerator;