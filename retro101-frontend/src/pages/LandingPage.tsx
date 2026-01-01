import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">retro101</h1>
        <p className="text-lg text-gray-600">
          Simple retrospectives for agile teams
        </p>
      </header>
      <main className="flex items-center justify-center">
        <button
          onClick={() => navigate('/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Room
        </button>
      </main>
    </div>
  );
}
