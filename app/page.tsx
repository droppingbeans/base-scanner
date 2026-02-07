'use client';

import { useEffect, useState } from 'react';
import { Button } from '@coinbase/cds-web/buttons';
import { Text } from '@coinbase/cds-web/typography';
import { Box, Container, Stack } from '@coinbase/cds-web/layout';
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
    <Box style={{ minHeight: '100vh', background: 'rgb(10, 11, 13)' }}>
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
        <Container style={{ padding: '1rem 1.5rem' }}>
          <Stack direction="horizontal" justify="space-between" align="center">
            <Stack direction="horizontal" gap={3} align="center">
              <Box style={{ 
                width: '2rem', 
                height: '2rem',
                background: 'linear-gradient(to bottom right, rgb(0, 82, 255), rgb(60, 138, 255))',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                🫘
              </Box>
              <Box>
                <Text weight="bold" size="lg">Base Scanner</Text>
                <Text size="xs" color="foregroundMuted">Real-time contract discovery</Text>
              </Box>
            </Stack>
            <Stack direction="horizontal" gap={3}>
              <Button variant="secondary" size="sm" as="a" href="/api/llms.txt" target="_blank">
                Agent API
              </Button>
              <Button variant="secondary" size="sm" as="a" href="https://github.com/droppingbeans/base-scanner" target="_blank">
                GitHub
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero */}
      <Box style={{ 
        padding: '5rem 1.5rem',
        background: 'linear-gradient(to bottom, rgba(10, 11, 13, 1), rgba(0, 0, 255, 0.05), rgba(10, 11, 13, 1))'
      }}>
        <Container style={{ maxWidth: '72rem' }}>
          <BinaryBeans />
          
          <Box style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Text as="h2" size="4xl" weight="bold">
              Discover Base Network
            </Text>
            <Text size="xl" color="foregroundMuted" style={{ marginTop: '1rem', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Track new tokens, NFTs, and smart contracts as they deploy. Real-time on-chain intelligence.
            </Text>
          </Box>
        </Container>
      </Box>

      <Container style={{ padding: '3rem 1.5rem', maxWidth: '84rem' }}>
        {/* Stats */}
        <Stack direction="horizontal" gap={4} style={{ marginBottom: '3rem', flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: '200px', padding: '1.5rem' }}>
            <Text size="sm" weight="medium" color="foregroundMuted">Total Discovered</Text>
            <Text size="4xl" weight="bold" color="primary" style={{ marginTop: '0.5rem' }}>
              {contracts.length}
            </Text>
          </Card>
          <Card style={{ flex: 1, minWidth: '200px', padding: '1.5rem' }}>
            <Text size="sm" weight="medium" color="foregroundMuted">Tokens</Text>
            <Text size="4xl" weight="bold" color="primary" style={{ marginTop: '0.5rem' }}>
              {contracts.filter(c => c.type === 'token').length}
            </Text>
          </Card>
          <Card style={{ flex: 1, minWidth: '200px', padding: '1.5rem' }}>
            <Text size="sm" weight="medium" color="foregroundMuted">NFTs</Text>
            <Text size="4xl" weight="bold" color="primary" style={{ marginTop: '0.5rem' }}>
              {contracts.filter(c => c.type === 'nft').length}
            </Text>
          </Card>
        </Stack>

        {/* Token Lookup */}
        <Card style={{ marginBottom: '3rem', overflow: 'hidden' }}>
          <Box style={{ borderBottom: '1px solid rgb(50, 53, 61)', padding: '1rem 1.5rem', background: 'rgba(10, 11, 13, 0.5)' }}>
            <Text size="lg" weight="bold">
              <span style={{ color: 'rgb(60, 138, 255)' }}>$</span> Token Lookup
            </Text>
          </Box>
          <Box style={{ padding: '1.5rem' }}>
            <Stack direction="horizontal" gap={3} style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
            </Stack>

            {tokenError && (
              <Box style={{ 
                background: 'rgba(207, 32, 47, 0.1)',
                border: '1px solid rgba(207, 32, 47, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <Text color="error" size="sm">{tokenError}</Text>
              </Box>
            )}

            {tokenInfo && (
              <Card style={{ background: 'rgba(10, 11, 13, 0.5)', padding: '1.5rem' }}>
                <Stack gap={4}>
                  <Stack direction="horizontal" justify="space-between" style={{ flexWrap: 'wrap' }}>
                    <Box>
                      <Text size="2xl" weight="bold">{tokenInfo.onchain?.name || 'Unknown'}</Text>
                      <Text size="sm" color="primary" weight="bold">${tokenInfo.onchain?.symbol || 'N/A'}</Text>
                    </Box>
                    {tokenInfo.market?.price && (
                      <Box>
                        <Text size="3xl" weight="bold" color="primary">
                          ${parseFloat(tokenInfo.market.price).toFixed(6)}
                        </Text>
                      </Box>
                    )}
                  </Stack>
                  <Stack direction="horizontal" gap={3} style={{ flexWrap: 'wrap' }}>
                    <Button variant="secondary" as="a" href={tokenInfo.links?.basescan} target="_blank">
                      Basescan
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            )}
          </Box>
        </Card>

        {/* Live Feed */}
        <Card>
          <Box style={{ borderBottom: '1px solid rgb(50, 53, 61)', padding: '1rem 1.5rem' }}>
            <Text size="lg" weight="bold">Live Feed</Text>
          </Box>
          {loading ? (
            <Box style={{ padding: '3rem', textAlign: 'center' }}>
              <Text color="foregroundMuted">Scanning...</Text>
            </Box>
          ) : (
            <Box style={{ padding: '1.5rem' }}>
              {contracts.length === 0 ? (
                <Text color="foregroundMuted">No contracts yet</Text>
              ) : (
                <Stack gap={4}>
                  {contracts.slice(0, 10).map(c => (
                    <Box key={c.address}>
                      <Text weight="bold">{c.name || 'Unknown'}</Text>
                      <Text size="sm" color="foregroundMuted">{c.address}</Text>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Card>
      </Container>

      {/* Footer */}
      <Box style={{ borderTop: '1px solid rgb(50, 53, 61)', marginTop: '4rem', padding: '2rem', textAlign: 'center' }}>
        <Text size="sm" color="foregroundMuted">
          Built by <Text as="a" href="https://x.com/DroppingBeans_" target="_blank" color="primary">@droppingbeans</Text> 🫘
        </Text>
      </Box>
    </Box>
  );
}
