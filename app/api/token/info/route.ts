import { NextRequest, NextResponse } from 'next/server';

const RPC_URL = 'https://mainnet.base.org';

async function rpcCall(address: string, method: string): Promise<string | null> {
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: address,
          data: method,
        }, 'latest'],
      }),
    });
    
    const data = await res.json();
    return data.result || null;
  } catch {
    return null;
  }
}

function decodeString(hex: string): string {
  if (!hex || hex === '0x') return 'Unknown';
  try {
    // Remove 0x prefix and decode
    const cleaned = hex.slice(2);
    // Skip first 64 chars (offset) and next 64 chars (length), then decode the rest
    const dataStart = 128; // 64 bytes offset + 64 bytes length
    const hexData = cleaned.slice(dataStart);
    const bytes = hexData.match(/.{1,2}/g) || [];
    const decoded = bytes
      .map(byte => parseInt(byte, 16))
      .filter(b => b !== 0)
      .map(b => String.fromCharCode(b))
      .join('');
    return decoded || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

function decodeUint(hex: string): number {
  if (!hex || hex === '0x') return 0;
  return parseInt(hex, 16);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Token address required' },
      { status: 400 }
    );
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid address format' },
      { status: 400 }
    );
  }

  try {
    // ERC20 method signatures
    const NAME_SIG = '0x06fdde03'; // name()
    const SYMBOL_SIG = '0x95d89b41'; // symbol()
    const DECIMALS_SIG = '0x313ce567'; // decimals()
    const TOTAL_SUPPLY_SIG = '0x18160ddd'; // totalSupply()

    // Make parallel RPC calls
    const [nameHex, symbolHex, decimalsHex, totalSupplyHex] = await Promise.all([
      rpcCall(address, NAME_SIG),
      rpcCall(address, SYMBOL_SIG),
      rpcCall(address, DECIMALS_SIG),
      rpcCall(address, TOTAL_SUPPLY_SIG),
    ]);

    const name = decodeString(nameHex || '');
    const symbol = decodeString(symbolHex || '');
    const decimals = decodeUint(decimalsHex || '0x0');
    const totalSupplyRaw = BigInt(totalSupplyHex || '0x0');
    const totalSupply = totalSupplyRaw / BigInt(10 ** decimals);

    // Fetch market data from DexScreener
    let marketData: any = {
      price: null,
      priceChange24h: null,
      liquidity: 0,
      volume24h: 0,
      dex: null,
      mainPair: null,
      chartUrl: null,
    };

    try {
      const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const dexData = await dexRes.json();
      
      if (dexData.pairs && dexData.pairs.length > 0) {
        const pair = dexData.pairs[0];
        marketData = {
          price: pair.priceUsd || null,
          priceChange24h: pair.priceChange?.h24 || null,
          liquidity: pair.liquidity?.usd || 0,
          volume24h: pair.volume?.h24 || 0,
          dex: pair.dexId || null,
          mainPair: pair.baseToken?.symbol && pair.quoteToken?.symbol
            ? `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`
            : null,
          chartUrl: pair.pairAddress
            ? `https://dexscreener.com/base/${pair.pairAddress}`
            : null,
        };
      }
    } catch (error) {
      console.error('DexScreener error:', error);
      // Continue with empty market data
    }

    return NextResponse.json({
      address,
      onchain: {
        name,
        symbol,
        decimals,
        totalSupply: totalSupply.toString(),
      },
      market: marketData,
      links: {
        basescan: `https://basescan.org/address/${address}`,
      },
    });
  } catch (error: any) {
    console.error('Token info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token info', details: error.message },
      { status: 500 }
    );
  }
}
