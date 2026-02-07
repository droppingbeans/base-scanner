'use client';

import { useEffect, useState } from 'react';

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
    // Initial load
    fetchContracts();
    
    // Poll every 10 seconds
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
      setTokenError('Please enter a token address');
      return;
    }

    setTokenLoading(true);
    setTokenError('');
    setTokenInfo(null);

    try {
      const res = await fetch(`/api/token/info?address=${encodeURIComponent(tokenAddress.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        setTokenError(data.error || 'Failed to fetch token info');
      } else {
        setTokenInfo(data);
      }
    } catch (error) {
      console.error('Token info error:', error);
      setTokenError('Failed to fetch token info');
    } finally {
      setTokenLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated floating beans */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bean-float absolute text-6xl opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          >
            🫘
          </div>
        ))}
      </div>

      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-blue-900/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🫘</div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Base Scanner
                  </h1>
                  <p className="text-sm text-blue-300/70">Real-time contract discovery</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/api/llms.txt"
                  target="_blank"
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors text-sm"
                >
                  Agent API
                </a>
                <a
                  href="https://github.com/droppingbeans/base-scanner"
                  target="_blank"
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors text-sm"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-900/30 rounded-xl p-6">
              <div className="text-sm text-blue-300/70 mb-2">Total Discovered</div>
              <div className="text-3xl font-bold text-blue-400">{contracts.length}</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-900/30 rounded-xl p-6">
              <div className="text-sm text-blue-300/70 mb-2">Tokens Found</div>
              <div className="text-3xl font-bold text-cyan-400">
                {contracts.filter(c => c.type === 'token').length}
              </div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-900/30 rounded-xl p-6">
              <div className="text-sm text-blue-300/70 mb-2">NFTs Found</div>
              <div className="text-3xl font-bold text-purple-400">
                {contracts.filter(c => c.type === 'nft').length}
              </div>
            </div>
          </div>

          {/* Token Lookup */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-900/30 rounded-xl overflow-hidden mb-8">
            <div className="border-b border-blue-900/30 px-6 py-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                🔍 Token Info Lookup
              </h2>
            </div>
            <div className="p-6">
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchTokenInfo()}
                  placeholder="Enter token address (0x...)"
                  className="flex-1 bg-slate-950/50 border border-blue-900/30 rounded-lg px-4 py-3 text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={fetchTokenInfo}
                  disabled={tokenLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
                >
                  {tokenLoading ? '🔄 Loading...' : 'Check Token'}
                </button>
              </div>

              {tokenError && (
                <div className="bg-red-950/50 border border-red-500/30 rounded-lg p-4 text-red-300">
                  {tokenError}
                </div>
              )}

              {tokenInfo && (
                <div className="bg-slate-950/50 border border-blue-900/30 rounded-lg p-6 space-y-6">
                  {/* Token Header */}
                  <div className="border-b border-blue-900/20 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {tokenInfo.onchain?.name || 'Unknown Token'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-blue-400 font-semibold">
                            {tokenInfo.onchain?.symbol || 'N/A'}
                          </span>
                          <span className="text-slate-500">•</span>
                          <a
                            href={tokenInfo.links?.basescan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                          >
                            {tokenInfo.address?.slice(0, 6)}...{tokenInfo.address?.slice(-4)}
                          </a>
                        </div>
                      </div>
                      {tokenInfo.market?.price && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-cyan-400">
                            ${parseFloat(tokenInfo.market.price).toFixed(6)}
                          </div>
                          {tokenInfo.market?.priceChange24h && (
                            <div className={`text-sm ${parseFloat(tokenInfo.market.priceChange24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {parseFloat(tokenInfo.market.priceChange24h) >= 0 ? '+' : ''}
                              {parseFloat(tokenInfo.market.priceChange24h).toFixed(2)}% (24h)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* On-Chain Data */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-3">📊 On-Chain Data</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Total Supply</div>
                        <div className="text-lg font-semibold">
                          {parseFloat(tokenInfo.onchain?.totalSupply || '0').toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-900/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Decimals</div>
                        <div className="text-lg font-semibold">
                          {tokenInfo.onchain?.decimals || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Data */}
                  {tokenInfo.market && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-3">💰 Market Data</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/30 rounded-lg p-3">
                          <div className="text-xs text-slate-400 mb-1">Liquidity</div>
                          <div className="text-lg font-semibold">
                            ${parseFloat(tokenInfo.market.liquidity || '0').toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-slate-900/30 rounded-lg p-3">
                          <div className="text-xs text-slate-400 mb-1">Volume (24h)</div>
                          <div className="text-lg font-semibold">
                            ${parseFloat(tokenInfo.market.volume24h || '0').toLocaleString()}
                          </div>
                        </div>
                        {tokenInfo.market.dex && tokenInfo.market.dex !== 'null' && (
                          <div className="bg-slate-900/30 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">DEX</div>
                            <div className="text-lg font-semibold">{tokenInfo.market.dex}</div>
                          </div>
                        )}
                        {tokenInfo.market.mainPair && tokenInfo.market.mainPair !== 'null' && (
                          <div className="bg-slate-900/30 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Main Pair</div>
                            <div className="text-lg font-semibold">{tokenInfo.market.mainPair}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3">
                    <a
                      href={tokenInfo.links?.basescan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors text-center text-sm"
                    >
                      View on Basescan
                    </a>
                    {tokenInfo.market?.chartUrl && tokenInfo.market.chartUrl !== 'null' && (
                      <a
                        href={tokenInfo.market.chartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg transition-colors text-center text-sm"
                      >
                        View Chart
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contract feed */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-900/30 rounded-xl overflow-hidden">
            <div className="border-b border-blue-900/30 px-6 py-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="animate-pulse">🔴</span>
                Live Contract Feed
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-blue-300/50">
                <div className="animate-spin text-4xl mb-4">🫘</div>
                <div>Scanning Base network...</div>
              </div>
            ) : contracts.length === 0 ? (
              <div className="p-12 text-center text-blue-300/50">
                No contracts discovered yet. Scanner is warming up...
              </div>
            ) : (
              <div className="divide-y divide-blue-900/20">
                {contracts.map((contract, idx) => (
                  <div
                    key={contract.address}
                    className="p-6 hover:bg-blue-950/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">
                            {contract.type === 'token' ? '🪙' : contract.type === 'nft' ? '🖼️' : '📄'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {contract.name && (
                                <span className="font-semibold text-lg">{contract.name}</span>
                              )}
                              {contract.symbol && (
                                <span className="text-blue-400 text-sm">({contract.symbol})</span>
                              )}
                            </div>
                            <a
                              href={`https://basescan.org/address/${contract.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-sm text-blue-300/70 hover:text-blue-300 transition-colors"
                            >
                              {contract.address}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Block {contract.blockNumber.toLocaleString()}</span>
                          <span>•</span>
                          <span>{new Date(contract.timestamp * 1000).toLocaleString()}</span>
                        </div>
                      </div>
                      {contract.score && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs text-blue-300/70">Interest Score</div>
                          <div className="text-2xl font-bold text-cyan-400">{contract.score}/100</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agent integration */}
          <div className="mt-8 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">🤖 Send Your Agent to Base Scanner</h2>
            <div className="bg-slate-950/50 rounded-lg p-4 mb-4 font-mono text-sm border border-blue-900/30">
              Read https://base-scanner.vercel.app/llms.txt and integrate
            </div>
            <div className="space-y-2 text-blue-200/80">
              <p><strong>1.</strong> Send the command above to your agent</p>
              <p><strong>2.</strong> Agent reads llms.txt and learns the API</p>
              <p><strong>3.</strong> Agent can query recent contracts, analyze tokens, and discover opportunities</p>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="/llms.txt"
                target="_blank"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
              >
                View llms.txt
              </a>
              <a
                href="https://github.com/droppingbeans/base-scanner"
                target="_blank"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-semibold"
              >
                View Source
              </a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-blue-900/50 mt-16 py-8">
          <div className="container mx-auto px-6 text-center text-blue-300/50 text-sm">
            Built by <a href="https://x.com/DroppingBeans_" target="_blank" className="text-blue-400 hover:text-blue-300">@droppingbeans</a> 🫘
            {' • '}
            <a href="https://github.com/droppingbeans/base-scanner" target="_blank" className="text-blue-400 hover:text-blue-300">Source</a>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
        
        .bean-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
