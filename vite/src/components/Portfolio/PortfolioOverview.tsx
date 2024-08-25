import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RootState } from '../../app/store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PortfolioOverview: React.FC = () => {
  const { totalValue, totalVolume, positions } = useSelector((state: RootState) => state.portfolio);

  // 포트폴리오 구성 데이터 생성
  const portfolioComposition = positions.reduce<{ name: string; value: number }[]>((acc, position) => {
    const existingAsset = acc.find(item => item.name === position.pair);
    if (existingAsset) {
      existingAsset.value += parseFloat(position.size);
    } else {
      acc.push({ name: position.pair, value: parseFloat(position.size) });
    }
    return acc;
  }, []);

  // 'Other' 카테고리 추가
  if (portfolioComposition.length > 3) {
    const otherValue = portfolioComposition.slice(3).reduce((sum, item) => sum + item.value, 0);
    portfolioComposition.splice(3, portfolioComposition.length - 3, { name: 'Other', value: otherValue });
  }

  return (
    <div className="bg-[#131722] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Overview</h2>
      <div className="flex">
        <div className="w-1/2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#72768f] mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-[#f0f0f0]">${totalValue}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#72768f] mb-2">Total Volume (24h)</h3>
            <p className="text-2xl font-bold text-[#f0f0f0]">${totalVolume}</p>
          </div>
        </div>
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={portfolioComposition}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | string, name: string) => [`$${Number(value).toFixed(2)}`, name]}
                contentStyle={{ background: '#1E222D', border: 'none' }}
                itemStyle={{ color: '#f0f0f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {portfolioComposition.map((entry, index) => (
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