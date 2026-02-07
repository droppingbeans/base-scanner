#!/bin/bash
# Token Info Fetcher - Get comprehensive token data on Base
# Usage: ./token-info.sh <token_address>

set -euo pipefail

TOKEN="${1:-}"

if [ -z "$TOKEN" ]; then
  echo "Usage: $0 <token_address>"
  echo "Example: $0 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  exit 1
fi

# Validate address format
if [[ ! "$TOKEN" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo "Error: Invalid token address format"
  exit 1
fi

RPC_URL="https://mainnet.base.org"

echo "🔍 Fetching token info for $TOKEN..."
echo ""

# Get on-chain data
echo "📊 On-Chain Data"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Name
NAME=$(cast call $TOKEN "name()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "Unknown")
echo "Name:        $NAME"

# Symbol
SYMBOL=$(cast call $TOKEN "symbol()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "Unknown")
echo "Symbol:      $SYMBOL"

# Decimals
DECIMALS=$(cast call $TOKEN "decimals()(uint8)" --rpc-url $RPC_URL 2>/dev/null || echo "18")
echo "Decimals:    $DECIMALS"

# Total Supply
TOTAL_SUPPLY_RAW=$(cast call $TOKEN "totalSupply()(uint256)" --rpc-url $RPC_URL 2>/dev/null || echo "0")
if [ "$TOTAL_SUPPLY_RAW" != "0" ] && [ -n "$DECIMALS" ]; then
  # Simple formatting without bc dependency
  TOTAL_SUPPLY=$(cast --to-unit $TOTAL_SUPPLY_RAW $DECIMALS 2>/dev/null || echo "Unknown")
else
  TOTAL_SUPPLY="Unknown"
fi
echo "Total Supply: $TOTAL_SUPPLY $SYMBOL"

echo ""

# Get market data from DexScreener
echo "💰 Market Data"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DEX_DATA=$(curl -s "https://api.dexscreener.com/latest/dex/tokens/$TOKEN" 2>/dev/null)

if [ -n "$DEX_DATA" ] && [ "$(echo "$DEX_DATA" | jq -r '.pairs[0]' 2>/dev/null)" != "null" ]; then
  PRICE=$(echo "$DEX_DATA" | jq -r '.pairs[0].priceUsd // "N/A"')
  LIQUIDITY=$(echo "$DEX_DATA" | jq -r '.pairs[0].liquidity.usd // 0')
  VOLUME_24H=$(echo "$DEX_DATA" | jq -r '.pairs[0].volume.h24 // 0')
  PRICE_CHANGE_24H=$(echo "$DEX_DATA" | jq -r '.pairs[0].priceChange.h24 // "N/A"')
  DEX=$(echo "$DEX_DATA" | jq -r '.pairs[0].dexId // "Unknown"')
  PAIR=$(echo "$DEX_DATA" | jq -r '.pairs[0].baseToken.symbol + "/" + .pairs[0].quoteToken.symbol // "Unknown"')
  
  echo "Price:       \$$PRICE"
  echo "24h Change:  ${PRICE_CHANGE_24H}%"
  echo "Liquidity:   \$$LIQUIDITY"
  echo "Volume (24h): \$$VOLUME_24H"
  echo "DEX:         $DEX"
  echo "Main Pair:   $PAIR"
  
  # DexScreener link
  PAIR_ADDRESS=$(echo "$DEX_DATA" | jq -r '.pairs[0].pairAddress // ""')
  if [ -n "$PAIR_ADDRESS" ]; then
    echo "Chart:       https://dexscreener.com/base/$PAIR_ADDRESS"
  fi
else
  echo "Price:       No liquidity pools found"
  echo "Note:        Token may not be traded on DEXs yet"
fi

echo ""

# Basescan verification check
echo "🔐 Security"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Contract:    $TOKEN"
echo "Basescan:    https://basescan.org/address/$TOKEN"

# Check if contract code exists (quick check)
echo "Status:      Check Basescan for verification"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
