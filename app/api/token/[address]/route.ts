import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    // Get on-chain data
    const [name, symbol, decimals, totalSupply] = await Promise.allSettled([
      client.readContract({
        address: address as `0x${string}`,
        abi: [parseAbiItem('function name() view returns (string)')],
        functionName: 'name',
      }),
      client.readContract({
        address: address as `0x${string}`,
        abi: [parseAbiItem('function symbol() view returns (string)')],
        functionName: 'symbol',
      }),
      client.readContract({
        address: address as `0x${string}`,
        abi: [parseAbiItem('function decimals() view returns (uint8)')],
        functionName: 'decimals',
      }),
      client.readContract({
        address: address as `0x${string}`,
        abi: [parseAbiItem('function totalSupply() view returns (uint256)')],
        functionName: 'totalSupply',
      }),
    ]);

    // Get market data from DexScreener
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const dexData = await dexRes.json();

    const tokenInfo = {
      address,
      name: name.status === 'fulfilled' ? name.value : 'Unknown',
      symbol: symbol.status === 'fulfilled' ? symbol.value : 'Unknown',
      decimals: decimals.status === 'fulfilled' ? Number(decimals.value) : 18,
      totalSupply: totalSupply.status === 'fulfilled' ? totalSupply.value.toString() : '0',
      price: dexData.pairs?.[0]?.priceUsd || null,
      liquidity: dexData.pairs?.[0]?.liquidity?.usd || 0,
      volume24h: dexData.pairs?.[0]?.volume?.h24 || 0,
      priceChange24h: dexData.pairs?.[0]?.priceChange?.h24 || null,
      dex: dexData.pairs?.[0]?.dexId || null,
      pair: dexData.pairs?.[0] ? `${dexData.pairs[0].baseToken.symbol}/${dexData.pairs[0].quoteToken.symbol}` : null,
      chartUrl: dexData.pairs?.[0]?.pairAddress ? `https://dexscreener.com/base/${dexData.pairs[0].pairAddress}` : null,
      basescanUrl: `https://basescan.org/address/${address}`,
    };

    return NextResponse.json(tokenInfo);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch token info', message: error.message },
      { status: 500 }
    );
  }
}
