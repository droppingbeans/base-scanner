'use client';

import { useEffect, useState } from 'react';
import BinaryBeans from './components/BinaryBeans';

interface Contract {
  address: string;
  deployer: string;
  blockNumber: number;
  timestamp: number;
  type: 'token' | 'nft' | 'unknown';
  name?: string;
  symbol?: string;
  score?: number;
}

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    fetchContracts();
    const interval = setInterval(fetchContracts, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchContracts() {
    try {
      const res = await fetch('/api/contracts/recent');
      const data = await res.json();
      setContracts(data.contracts || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      setLoading(false);
    }
  }

  async function fetchTokenInfo() {
    if (!tokenAddress.trim()) {
      setTokenError('Enter token address');
      return;
    }

    setTokenLoading(true);
    setTokenError('');
    setTokenInfo(null);

    try {
      const res = await fetch(`/api/token/info?address=${encodeURIComponent(tokenAddress.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        setTokenError(data.error || 'Failed to fetch');
      } else {
        setTokenInfo(data);
      }
    } catch (error) {
      setTokenError('Request failed');
    } finally {
      setTokenLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      {/* Header */}
      <header className="border-b border-[#32353d] bg-[#0a0b0d]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0000ff] to-[#3c8aff] rounded-md flex items-center justify-center text-xl">
                🫘
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Base Scanner</h1>
                <p className="text-xs text-[#717886]">Real-time contract discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/api/llms.txt"
                target="_blank"
                className="px-4 py-2 text-sm font-medium text-[#3c8aff] hover:text-[#0000ff] border border-[#32353d] hover:border-[#3c8aff] rounded-lg transition-all"
              >
                Agent API
              </a>
              <a
                href="https://github.com/droppingbeans/base-scanner"
                target="_blank"
                className="px-4 py-2 text-sm font-medium bg-[#32353d] hover:bg-[#5b616e] border border-[#32353d] rounded-lg transition-all"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0b0d] via-[#0000ff]/10 to-[#0a0b0d]">
        <div className="container mx-auto max-w-6xl">
          <BinaryBeans />
          
          <div className="mt-12 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover Base Network
            </h2>
            <p className="text-xl text-[#b1b7c3] max-w-2xl mx-auto">
              Track new tokens, NFTs, and smart contracts as they deploy. Real-time on-chain intelligence.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#32353d]/30 border border-[#32353d] rounded-xl p-6 hover:border-[#3c8aff]/50 transition-all">
            <div className="text-sm font-medium text-[#b1b7c3] mb-2">Total Discovered</div>
            <div className="text-4xl font-bold text-[#3c8aff]">{contracts.length}</div>
          </div>
          <div className="bg-[#32353d]/30 border border-[#32353d] rounded-xl p-6 hover:border-[#3c8aff]/50 transition-all">
            <div className="text-sm font-medium text-[#b1b7c3] mb-2">Tokens</div>
            <div className="text-4xl font-bold text-[#3c8aff]">
              {contracts.filter(c => c.type === 'token').length}
            </div>
          </div>
          <div className="bg-[#32353d]/30 border border-[#32353d] rounded-xl p-6 hover:border-[#3c8aff]/50 transition-all">
            <div className="text-sm font-medium text-[#b1b7c3] mb-2">NFTs</div>
            <div className="text-4xl font-bold text-[#3c8aff]">
              {contracts.filter(c => c.type === 'nft').length}
            </div>
          </div>
        </div>

        {/* Token Lookup */}
        <div className="bg-[#32353d]/20 border border-[#32353d] rounded-xl overflow-hidden mb-12">
          <div className="border-b border-[#32353d] px-6 py-4 bg-[#0a0b0d]/50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-[#3c8aff]">$</span> Token Lookup
            </h2>
          </div>
          <div className="p-6">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchTokenInfo()}
                placeholder="0x..."
                className="flex-1 bg-[#0a0b0d] border border-[#32353d] focus:border-[#3c8aff] rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-[#5b616e] focus:outline-none transition-all"
              />
              <button
                onClick={fetchTokenInfo}
                disabled={tokenLoading}
                className="px-8 py-3 bg-[#0000ff] hover:bg-[#3c8aff] disabled:bg-[#32353d] disabled:cursor-not-allowed rounded-lg transition-all font-semibold text-sm"
              >
                {tokenLoading ? 'Loading...' : 'Check'}
              </button>
            </div>

            {tokenError && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4 text-red-300 text-sm mb-6">
                {tokenError}
              </div>
            )}

            {tokenInfo && (
              <div className="space-y-6">
                {/* Token Header */}
                <div className="flex items-start justify-between pb-6 border-b border-[#32353d]">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {tokenInfo.onchain?.name || 'Unknown'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#3c8aff] font-bold">
                        ${tokenInfo.onchain?.symbol || 'N/A'}
                      </span>
                      <span className="text-[#5b616e]">•</span>
                      <a
                        href={tokenInfo.links?.basescan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#717886] hover:text-[#3c8aff] font-mono text-xs transition-colors"
                      >
                        {tokenInfo.address?.slice(0, 6)}...{tokenInfo.address?.slice(-4)}
                      </a>
                    </div>
                  </div>
                  {tokenInfo.market?.price && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#3c8aff]">
                        ${parseFloat(tokenInfo.market.price).toFixed(6)}
                      </div>
                      {tokenInfo.market?.priceChange24h && (
                        <div className={`text-sm font-semibold ${parseFloat(tokenInfo.market.priceChange24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {parseFloat(tokenInfo.market.priceChange24h) >= 0 ? '+' : ''}
                          {parseFloat(tokenInfo.market.priceChange24h).toFixed(2)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0a0b0d] border border-[#32353d] rounded-lg p-4">
                    <div className="text-xs text-[#717886] mb-1">Supply</div>
                    <div className="text-lg font-bold">
                      {parseFloat(tokenInfo.onchain?.totalSupply || '0').toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#0a0b0d] border border-[#32353d] rounded-lg p-4">
                    <div className="text-xs text-[#717886] mb-1">Decimals</div>
                    <div className="text-lg font-bold">{tokenInfo.onchain?.decimals || 'N/A'}</div>
                  </div>
                  <div className="bg-[#0a0b0d] border border-[#32353d] rounded-lg p-4">
                    <div className="text-xs text-[#717886] mb-1">Liquidity</div>
                    <div className="text-lg font-bold">
                      ${parseFloat(tokenInfo.market?.liquidity || '0').toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#0a0b0d] border border-[#32353d] rounded-lg p-4">
                    <div className="text-xs text-[#717886] mb-1">Volume 24h</div>
                    <div className="text-lg font-bold">
                      ${parseFloat(tokenInfo.market?.volume24h || '0').toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4">
                  <a
                    href={tokenInfo.links?.basescan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-[#32353d]/50 hover:bg-[#32353d] border border-[#32353d] hover:border-[#3c8aff] rounded-lg transition-all text-center text-sm font-medium"
                  >
                    Basescan
                  </a>
                  {tokenInfo.market?.chartUrl && tokenInfo.market.chartUrl !== 'null' && (
                    <a
                      href={tokenInfo.market.chartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-[#0000ff]/20 hover:bg-[#0000ff]/30 border border-[#0000ff]/50 hover:border-[#3c8aff] rounded-lg transition-all text-center text-sm font-medium"
                    >
                      Chart
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-[#32353d]/20 border border-[#32353d] rounded-xl overflow-hidden">
          <div className="border-b border-[#32353d] px-6 py-4 bg-[#0a0b0d]/50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#0000ff] rounded-full animate-pulse"></span>
              Live Feed
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#3c8aff] border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-[#717886]">Scanning network...</div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="p-12 text-center text-[#717886]">
              No contracts discovered yet
            </div>
          ) : (
            <div className="divide-y divide-[#32353d]">
              {contracts.map((contract) => (
                <div
                  key={contract.address}
                  className="p-6 hover:bg-[#32353d]/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl">
                          {contract.type === 'token' ? '🪙' : contract.type === 'nft' ? '🖼️' : '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          {contract.name && (
                            <div className="font-bold text-lg mb-1">
                              {contract.name}
                              {contract.symbol && (
                                <span className="ml-2 text-sm text-[#3c8aff]">({contract.symbol})</span>
                              )}
                            </div>
                          )}
                          <a
                            href={`https://basescan.org/address/${contract.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-[#717886] hover:text-[#3c8aff] transition-colors"
                          >
                            {contract.address}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#5b616e]">
                        <span>Block {contract.blockNumber.toLocaleString()}</span>
                        <span>•</span>
                        <span>{new Date(contract.timestamp * 1000).toLocaleString()}</span>
                      </div>
                    </div>
                    {contract.score && (
                      <div className="text-right">
                        <div className="text-xs text-[#717886] mb-1">Score</div>
                        <div className="text-2xl font-bold text-[#3c8aff]">{contract.score}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Integration */}
        <div className="mt-12 bg-gradient-to-br from-[#0000ff]/10 to-[#3c8aff]/10 border border-[#0000ff]/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">🤖 Agent API</h2>
          <div className="bg-[#0a0b0d] rounded-lg p-4 mb-4 font-mono text-sm border border-[#32353d] text-[#3c8aff]">
            Read https://base-scanner.vercel.app/llms.txt
          </div>
          <p className="text-[#b1b7c3] mb-6">
            Send this command to your agent. It will learn the API and can query contracts, analyze tokens, and discover opportunities.
          </p>
          <div className="flex gap-3">
            <a
              href="/llms.txt"
              target="_blank"
              className="px-6 py-3 bg-[#0000ff] hover:bg-[#3c8aff] rounded-lg transition-all font-semibold"
            >
              View API Docs
            </a>
            <a
              href="https://github.com/droppingbeans/base-scanner"
              target="_blank"
              className="px-6 py-3 bg-[#32353d] hover:bg-[#5b616e] rounded-lg transition-all font-semibold"
            >
              Source Code
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#32353d] mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-[#717886] text-sm">
          Built by <a href="https://x.com/DroppingBeans_" target="_blank" className="text-[#3c8aff] hover:text-[#0000ff] transition-colors">@droppingbeans</a> 🫘
          {' • '}
          <a href="https://github.com/droppingbeans/base-scanner" target="_blank" className="text-[#3c8aff] hover:text-[#0000ff] transition-colors">Source</a>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float-dot {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.8;
          }
        }
        
        .animate-float-dot {
          animation: float-dot ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
