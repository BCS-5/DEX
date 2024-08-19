import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PortfolioOverview: React.FC = () => {
  const { totalValue, totalVolume } = useSelector((state: RootState) => state.portfolio);

  const data = [
    { name: 'USDC', value: 40 },
    { name: 'WETH', value: 30 },
    { name: 'WBTC', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-[#1E222D] p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-semibold mb-6 text-[#f0f0f0]">Overview</h2>
      <div className="flex items-center">
        <div className="w-1/2 pr-8 border-r border-[#2A2E39]">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#72768f] mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-[#f0f0f0]">${totalValue}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#72768f] mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-[#f0f0f0]">${totalVolume}</p>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center mr-4">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-[#72768f]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;