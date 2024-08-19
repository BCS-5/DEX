import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import PortfolioOverview from '../components/Portfolio/PortfolioOverview';
import PortfolioPositions from '../components/Portfolio/PortfolioPositions';
import PortfolioOrders from '../components/Portfolio/PortfolioOrders';
import PortfolioLiquidity from '../components/Portfolio/PortfolioLiquidity';
import AccountSection from '../components/Portfolio/AccountSection';
import PortfolioHistory from '../components/Portfolio/PortfolioHistory';
import { RootState, AppDispatch } from '../app/store';
import { fetchPortfolioData } from '../features/portfolio/portfolioSlice';
import { contracts } from '../contracts/addresses';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history'>('portfolio');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { signer, provider } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    if (signer) {
      dispatch(fetchPortfolioData());
      const intervalId = setInterval(() => dispatch(fetchPortfolioData()), 30000);
      return () => clearInterval(intervalId);
    }
  }, [dispatch, signer]);

  const handleDataUpdate = useCallback(() => {
    dispatch(fetchPortfolioData());
  }, [dispatch]);

  const handleDeposit = async () => {
    if (!signer || !provider) return;

    try {
      const usdtContract = new ethers.Contract(contracts.usdt.address, contracts.usdt.abi, signer);
      const vaultContract = new ethers.Contract(contracts.vault.address, contracts.vault.abi, signer);

      const approveTx = await usdtContract.approve(contracts.vault.address, ethers.parseUnits(depositAmount, 6));
      await approveTx.wait();

      const depositTx = await vaultContract.deposit(ethers.parseUnits(depositAmount, 6));
      await depositTx.wait();

      handleDataUpdate();
      setDepositAmount('');
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!signer || !provider) return;

    try {
      const vaultContract = new ethers.Contract(contracts.vault.address, contracts.vault.abi, signer);

      const withdrawTx = await vaultContract.withdraw(ethers.parseUnits(withdrawAmount, 6));
      await withdrawTx.wait();

      handleDataUpdate();
      setWithdrawAmount('');
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0D111C] text-[#72768f]">
      <div className="flex-grow p-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8 text-[#f0f0f0]">Portfolio</h1>
          
          <div className="flex gap-6 mb-8">
            <div className="flex-grow flex flex-col">
              <div className="flex-grow mb-6 h-[496px]">
                <PortfolioOverview />
              </div>
            </div>
            <div className="flex-none w-[300px] flex flex-col">
              <AccountSection />
              <div className="mt-4 bg-[#1E222D] p-4 rounded-lg flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Deposit</h2>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Deposit amount"
                    className="w-full p-2 bg-[#131722] text-[#f0f0f0] rounded"
                  />
                  <button
                    onClick={handleDeposit}
                    className="mt-2 w-full bg-[#1DB1A8] text-white p-2 rounded hover:bg-[#19998F] transition-colors"
                  >
                    Deposit
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#f0f0f0]">Withdraw</h2>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Withdraw amount"
                    className="w-full p-2 bg-[#131722] text-[#f0f0f0] rounded"
                  />
                  <button
                    onClick={handleWithdraw}
                    className="mt-2 w-full bg-[#363A45] text-white p-2 rounded hover:bg-[#2A2E3E] transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex mb-6 border-b border-[#1E222D]">
            <button 
              className={`mr-8 pb-3 text-lg font-medium ${activeTab === 'portfolio' ? 'border-b-2 border-[#1DB1A8] text-[#1DB1A8]' : 'text-[#f0f0f0]'}`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            <button 
              className={`pb-3 text-lg font-medium ${activeTab === 'history' ? 'border-b-2 border-[#1DB1A8] text-[#1DB1A8]' : 'text-[#f0f0f0]'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          
          
          <div className="space-y-6"> {/* Add space between boxes */}
            {activeTab === 'portfolio' ? (
              <>
                <div className="bg-[#1E222D] p-4 rounded-lg shadow-lg">
                  <PortfolioPositions onUpdateData={handleDataUpdate} />
                </div>
                <div className="bg-[#1E222D] p-4 rounded-lg shadow-lg">
                  <PortfolioOrders onUpdateData={handleDataUpdate} />
                </div>
                <div className="bg-[#1E222D] p-4 rounded-lg shadow-lg">
                  <PortfolioLiquidity onUpdateData={handleDataUpdate} />
                </div>
              </>
            ) : (
              <PortfolioHistory />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;