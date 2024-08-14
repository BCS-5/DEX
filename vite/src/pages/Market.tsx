import React from 'react';
import MarketFilter from '../components/Market/MarketFilter';
import MarketTable from '../components/Market/MarketTable';

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Markets</h1>
        <MarketFilter />
        <MarketTable />
      </main>
    </div>
  );
}

export default App;