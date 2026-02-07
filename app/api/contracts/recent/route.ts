import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

// In-memory cache (in production, use Redis/database)
let contractCache: any[] = [];
let lastScannedBlock = 0n;

async function scanRecentBlocks() {
  try {
    const latestBlock = await client.getBlockNumber();
    const startBlock = lastScannedBlock === 0n ? latestBlock - 100n : lastScannedBlock + 1n;
    
    if (startBlock > latestBlock) return;

    // Scan for contract creations
    const logs = await client.getLogs({
      fromBlock: startBlock,
      toBlock: latestBlock,
      // Contract creation events leave traces
    });

    // Get recent blocks and check for contract creations
    for (let i = startBlock; i <= latestBlock && i < startBlock + 20n; i++) {
      try {
        const block = await client.getBlock({ blockNumber: i, includeTransactions: true });
        
        for (const tx of block.transactions) {
          if (typeof tx === 'string') continue;
          
          // Contract creation has null 'to' address
          if (!tx.to) {
            const receipt = await client.getTransactionReceipt({ hash: tx.hash });
            if (receipt.contractAddress) {
              // Try to detect contract type
              let type: 'token' | 'nft' | 'unknown' = 'unknown';
              let name, symbol;
              
              try {
                // Try ERC20
                name = await client.readContract({
                  address: receipt.contractAddress,
                  abi: [parseAbiItem('function name() view returns (string)')],
                  functionName: 'name',
                });
                symbol = await client.readContract({
                  address: receipt.contractAddress,
                  abi: [parseAbiItem('function symbol() view returns (string)')],
                  functionName: 'symbol',
                });
                type = 'token';
              } catch {
                // Not a token, might be NFT
                try {
                  await client.readContract({
                    address: receipt.contractAddress,
                    abi: [parseAbiItem('function tokenURI(uint256) view returns (string)')],
                    functionName: 'tokenURI',
                    args: [1n],
                  });
                  type = 'nft';
                } catch {
                  // Unknown type
                }
              }

              const contract = {
                address: receipt.contractAddress,
                deployer: tx.from,
                blockNumber: Number(block.number),
                timestamp: Number(block.timestamp),
                type,
                name,
                symbol,
                score: Math.floor(Math.random() * 50) + 50, // TODO: Real scoring
              };

              contractCache.unshift(contract);
            }
          }
        }
      } catch (err) {
        console.error(`Error scanning block ${i}:`, err);
      }
    }

    lastScannedBlock = latestBlock;
    contractCache = contractCache.slice(0, 100); // Keep last 100
  } catch (error) {
    console.error('Scan error:', error);
  }
}

export async function GET() {
  // Scan in background (non-blocking)
  scanRecentBlocks().catch(console.error);

  return NextResponse.json({
    contracts: contractCache,
    lastBlock: Number(lastScannedBlock),
  });
}
