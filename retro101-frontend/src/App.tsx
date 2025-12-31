export function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">retro101</h1>
        <p className="text-lg text-gray-600">
          Simple retrospectives for agile teams
        </p>
      </header>
      <main className="flex items-center justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors">
          Create New Room
        </button>
      </main>
    </div>
  );
}

export default App;
