'use client';

import { useEffect, useState } from 'react';
import { Button } from '@coinbase/cds-web/buttons';
import { Text } from '@coinbase/cds-web/typography';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { TextInput } from '@coinbase/cds-web/controls';
import { Card } from '@coinbase/cds-web/cards';
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
    <Box style={{ background: 'rgb(10, 11, 13)', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        style={{ 
          borderBottom: '1px solid rgb(50, 53, 61)',
          background: 'rgba(10, 11, 13, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 50 
        }}
      >
        <Box maxWidth="1400px" style={{ marginLeft: "auto", marginRight: "auto" }} style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
          <HStack justify="space-between" align="center">
            <HStack gap={3} align="center">
              <Box
                style={{ 
                  width: '2rem', 
                  height: '2rem',
                  background: 'linear-gradient(to bottom right, rgb(0, 82, 255), rgb(60, 138, 255))',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}
              >
                🫘
              </Box>
              <VStack gap={0}>
                <Text weight="bold" size="lg">Base Scanner</Text>
                <Text size="xs" color="foregroundMuted">Real-time contract discovery</Text>
              </VStack>
            </HStack>
            <HStack gap={3}>
              <Button variant="secondary" size="sm" as="a" href="/api/llms.txt" target="_blank">
                Agent API
              </Button>
              <Button variant="secondary" size="sm" as="a" href="https://github.com/droppingbeans/base-scanner" target="_blank">
                GitHub
              </Button>
            </HStack>
          </HStack>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
        style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
        style={{ 
          background: 'linear-gradient(to bottom, rgba(10, 11, 13, 1), rgba(0, 82, 255, 0.05), rgba(10, 11, 13, 1))'
        }}
      >
        <Box maxWidth="1152px" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <BinaryBeans />
          
          <VStack gap={4} align="center" style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Text as="h2" size="4xl" weight="bold">
              Discover Base Network
            </Text>
            <Text size="xl" color="foregroundMuted" style={{ maxWidth: '42rem' }}>
              Track new tokens, NFTs, and smart contracts as they deploy. Real-time on-chain intelligence.
            </Text>
          </VStack>
        </Box>
      </Box>

      <Box maxWidth="1400px" style={{ marginLeft: "auto", marginRight: "auto" }} style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }} style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        {/* Stats */}
        <HStack gap={4} style={{ marginBottom: '3rem', flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: '200px' }} padding={6}>
            <VStack gap={2}>
              <Text size="sm" weight="medium" color="foregroundMuted">Total Discovered</Text>
              <Text size="4xl" weight="bold" color="primary">
                {contracts.length}
              </Text>
            </VStack>
          </Card>
          <Card style={{ flex: 1, minWidth: '200px' }} padding={6}>
            <VStack gap={2}>
              <Text size="sm" weight="medium" color="foregroundMuted">Tokens</Text>
              <Text size="4xl" weight="bold" color="primary">
                {contracts.filter(c => c.type === 'token').length}
              </Text>
            </VStack>
          </Card>
          <Card style={{ flex: 1, minWidth: '200px' }} padding={6}>
            <VStack gap={2}>
              <Text size="sm" weight="medium" color="foregroundMuted">NFTs</Text>
              <Text size="4xl" weight="bold" color="primary">
                {contracts.filter(c => c.type === 'nft').length}
              </Text>
            </VStack>
          </Card>
        </HStack>

        {/* Token Lookup */}
        <Card style={{ marginBottom: '3rem' }}>
          <Box padding={6} style={{ borderBottom: '1px solid rgb(50, 53, 61)', background: 'rgba(30, 32, 37, 0.5)' }}>
            <Text size="lg" weight="bold">
              <span style={{ color: 'rgb(60, 138, 255)' }}>$</span> Token Lookup
            </Text>
          </Box>
          <Box padding={6}>
            <HStack gap={3} style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <TextInput
                value={tokenAddress}
                onChange={(e: any) => setTokenAddress(e.target.value)}
                onKeyPress={(e: any) => e.key === 'Enter' && fetchTokenInfo()}
                placeholder="0x..."
                style={{ flex: 1, minWidth: '200px' }}
              />
              <Button 
                onClick={fetchTokenInfo}
                disabled={tokenLoading}
              >
                {tokenLoading ? 'Loading...' : 'Check'}
              </Button>
            </HStack>

            {tokenError && (
              <Box
                padding={4}
                style={{ 
                  marginBottom: '1.5rem',
                  background: 'rgba(207, 32, 47, 0.1)',
                  border: '1px solid rgba(207, 32, 47, 0.3)',
                  borderRadius: '0.5rem'
                }}
              >
                <Text color="negative" size="sm">{tokenError}</Text>
              </Box>
            )}

            {tokenInfo && (
              <Card padding={6} style={{ background: 'rgba(30, 32, 37, 0.5)' }}>
                <VStack gap={4}>
                  <HStack justify="space-between" style={{ flexWrap: 'wrap' }}>
                    <VStack gap={1}>
                      <Text size="2xl" weight="bold">{tokenInfo.onchain?.name || 'Unknown'}</Text>
                      <Text size="sm" color="primary" weight="bold">
                        ${tokenInfo.onchain?.symbol || 'N/A'}
                      </Text>
                    </VStack>
                    {tokenInfo.market?.price && (
                      <VStack gap={1} align="end">
                        <Text size="3xl" weight="bold" color="primary">
                          ${parseFloat(tokenInfo.market.price).toFixed(6)}
                        </Text>
                        {tokenInfo.market?.priceChange24h && (
                          <Text 
                            size="sm" 
                            weight="semibold"
                            color={parseFloat(tokenInfo.market.priceChange24h) >= 0 ? 'positive' : 'negative'}
                          >
                            {parseFloat(tokenInfo.market.priceChange24h) >= 0 ? '+' : ''}
                            {parseFloat(tokenInfo.market.priceChange24h).toFixed(2)}%
                          </Text>
                        )}
                      </VStack>
                    )}
                  </HStack>
                  <HStack gap={3} style={{ flexWrap: 'wrap' }}>
                    <Button variant="secondary" as="a" href={tokenInfo.links?.basescan} target="_blank">
                      Basescan
                    </Button>
                    {tokenInfo.market?.chartUrl && tokenInfo.market.chartUrl !== 'null' && (
                      <Button as="a" href={tokenInfo.market.chartUrl} target="_blank">
                        Chart
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Card>
            )}
          </Box>
        </Card>

        {/* Live Feed */}
        <Card>
          <Box padding={6} style={{ borderBottom: '1px solid rgb(50, 53, 61)', background: 'rgba(30, 32, 37, 0.5)' }}>
            <HStack gap={2} align="center">
              <Box
                style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  background: 'rgb(0, 82, 255)',
                  borderRadius: '50%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              <Text size="lg" weight="bold">Live Feed</Text>
            </HStack>
          </Box>
          
          {loading ? (
            <Box padding={12} style={{ textAlign: 'center' }}>
              <Text color="foregroundMuted">Scanning network...</Text>
            </Box>
          ) : contracts.length === 0 ? (
            <Box padding={12} style={{ textAlign: 'center' }}>
              <Text color="foregroundMuted">No contracts discovered yet</Text>
            </Box>
          ) : (
            <VStack gap={0}>
              {contracts.slice(0, 10).map((contract, idx) => (
                <Box 
                  key={contract.address}
                  padding={6}
                  style={{ 
                    borderBottom: idx < Math.min(contracts.length, 10) - 1 ? '1px solid rgb(50, 53, 61)' : undefined,
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  <HStack gap={3} justify="space-between">
                    <HStack gap={3} style={{ flex: 1, minWidth: 0 }}>
                      <Box style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                        {contract.type === 'token' ? '🪙' : contract.type === 'nft' ? '🖼️' : '📄'}
                      </Box>
                      <VStack gap={1} style={{ flex: 1, minWidth: 0 }}>
                        {contract.name && (
                          <HStack gap={2} align="center" style={{ flexWrap: 'wrap' }}>
                            <Text weight="bold" size="lg">{contract.name}</Text>
                            {contract.symbol && (
                              <Text size="sm" color="primary">({contract.symbol})</Text>
                            )}
                          </HStack>
                        )}
                        <Text
                          as="a"
                          href={`https://basescan.org/address/${contract.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          color="foregroundMuted"
                          style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                        >
                          {contract.address}
                        </Text>
                        <HStack gap={3} style={{ marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          <Text size="sm" color="foregroundMuted">
                            Block {contract.blockNumber.toLocaleString()}
                          </Text>
                          <Text size="sm" color="foregroundMuted">•</Text>
                          <Text size="sm" color="foregroundMuted">
                            {new Date(contract.timestamp * 1000).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    {contract.score && (
                      <VStack gap={1} align="end">
                        <Text size="xs" color="foregroundMuted">Score</Text>
                        <Text size="2xl" weight="bold" color="primary">{contract.score}</Text>
                      </VStack>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Card>

        {/* Agent Integration */}
        <Card 
          padding={8}
          style={{ 
            marginTop: '3rem',
            background: 'linear-gradient(to bottom right, rgba(0, 82, 255, 0.05), rgba(60, 138, 255, 0.05))',
            border: '1px solid rgba(0, 82, 255, 0.3)'
          }}
        >
          <VStack gap={4}>
            <Text size="2xl" weight="bold">🤖 Agent API</Text>
            <Box
              padding={4}
              style={{
                background: 'rgb(10, 11, 13)',
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'rgb(60, 138, 255)'
              }}
            >
              Read https://base-scanner.vercel.app/llms.txt
            </Box>
            <Text color="foregroundMuted">
              Send this command to your agent. It will learn the API and can query contracts, analyze tokens, and discover opportunities.
            </Text>
            <HStack gap={3}>
              <Button as="a" href="/llms.txt" target="_blank">
                View API Docs
              </Button>
              <Button variant="secondary" as="a" href="https://github.com/droppingbeans/base-scanner" target="_blank">
                Source Code
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Box>

      {/* Footer */}
      <Box 
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
        style={{ 
          borderTop: '1px solid rgb(50, 53, 61)', 
          marginTop: '4rem', 
          textAlign: 'center' 
        }}
      >
        <Text size="sm" color="foregroundMuted">
          Built by{' '}
          <Text as="a" href="https://x.com/DroppingBeans_" target="_blank" color="primary">
            @droppingbeans
          </Text>
          {' '}🫘{' • '}
          <Text as="a" href="https://github.com/droppingbeans/base-scanner" target="_blank" color="primary">
            Source
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
