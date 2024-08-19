import React from 'react';

const categories = ['All', 'Recently Listed', 'Layer 1', 'Layer 2', 'DeFi', 'AI', 'NFT', 'Gaming', 'Meme', 'RWA', 'Entertainment'];

interface MarketCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MarketCategories: React.FC<MarketCategoriesProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex overflow-x-auto mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 mr-2 rounded-md ${
            activeCategory === category ? 'bg-[#5973fe] text-white' : 'bg-[#1E1F31] text-[#72768f]'
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MarketCategories;