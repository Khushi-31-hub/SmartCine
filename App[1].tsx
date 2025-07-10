
import React, { useState, useCallback } from 'react';
import { getMovieRecommendations } from './services/geminiService';
import type { MovieRecommendation } from './types';
import { MovieCard } from './components/MovieCard';
import { LoadingSpinner, FilmReelIcon, ErrorIcon } from './components/Icons';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter some movies you like.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const result = await getMovieRecommendations(userInput);
      setRecommendations(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get recommendations. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <FilmReelIcon className="w-12 h-12 text-indigo-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              CineSuggest AI
            </h1>
          </div>
          <p className="text-gray-400">Discover your next favorite movie from around the world.</p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="mb-10">
            <label htmlFor="movie-input" className="block text-lg font-medium text-gray-300 mb-2">
              Tell me some movies you love...
            </label>
            <textarea
              id="movie-input"
              value={userInput}
              onChange={handleInputChange}
              className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 placeholder-gray-500 resize-none"
              placeholder="e.g., Parasite, The Dark Knight, Spirited Away, RRR"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Finding Gems...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>
          
          <div className="results-section">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <ErrorIcon className="w-6 h-6" />
                <p>{error}</p>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Here are some movies you might enjoy:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((movie, index) => (
                    <MovieCard key={`${movie.title}-${index}`} movie={movie} />
                  ))}
                </div>
              </div>
            )}
             {!isLoading && !error && recommendations.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    <FilmReelIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Your personalized movie recommendations will appear here.</p>
                </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
