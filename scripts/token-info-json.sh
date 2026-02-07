#!/bin/bash
# Token Info Fetcher (JSON output) - Get comprehensive token data on Base
# Usage: ./token-info-json.sh <token_address>

set -euo pipefail

TOKEN="${1:-}"

if [ -z "$TOKEN" ]; then
  echo '{"error": "Token address required"}'
  exit 1
fi

# Validate address format
if [[ ! "$TOKEN" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo '{"error": "Invalid token address format"}'
  exit 1
fi

RPC_URL="https://mainnet.base.org"

# Get on-chain data
NAME=$(cast call $TOKEN "name()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "Unknown")
SYMBOL=$(cast call $TOKEN "symbol()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "Unknown")
DECIMALS=$(cast call $TOKEN "decimals()(uint8)" --rpc-url $RPC_URL 2>/dev/null || echo "18")
TOTAL_SUPPLY_RAW=$(cast call $TOKEN "totalSupply()(uint256)" --rpc-url $RPC_URL 2>/dev/null || echo "0")

if [ "$TOTAL_SUPPLY_RAW" != "0" ] && [ -n "$DECIMALS" ]; then
  TOTAL_SUPPLY=$(cast --to-unit $TOTAL_SUPPLY_RAW $DECIMALS 2>/dev/null || echo "0")
else
  TOTAL_SUPPLY="0"
fi

# Get market data from DexScreener
DEX_DATA=$(curl -s "https://api.dexscreener.com/latest/dex/tokens/$TOKEN" 2>/dev/null || echo '{}')

PRICE="null"
LIQUIDITY="0"
VOLUME_24H="0"
PRICE_CHANGE_24H="null"
DEX="null"
PAIR="null"
CHART_URL="null"

if [ -n "$DEX_DATA" ] && [ "$(echo "$DEX_DATA" | jq -r '.pairs[0]' 2>/dev/null)" != "null" ]; then
  PRICE=$(echo "$DEX_DATA" | jq -r '.pairs[0].priceUsd // null')
  LIQUIDITY=$(echo "$DEX_DATA" | jq -r '.pairs[0].liquidity.usd // 0')
  VOLUME_24H=$(echo "$DEX_DATA" | jq -r '.pairs[0].volume.h24 // 0')
  PRICE_CHANGE_24H=$(echo "$DEX_DATA" | jq -r '.pairs[0].priceChange.h24 // null')
  DEX=$(echo "$DEX_DATA" | jq -r '.pairs[0].dexId // null')
  PAIR=$(echo "$DEX_DATA" | jq -r '(.pairs[0].baseToken.symbol // "") + "/" + (.pairs[0].quoteToken.symbol // "") // null')
  PAIR_ADDRESS=$(echo "$DEX_DATA" | jq -r '.pairs[0].pairAddress // ""')
  
  if [ -n "$PAIR_ADDRESS" ] && [ "$PAIR_ADDRESS" != "null" ]; then
    CHART_URL="https://dexscreener.com/base/$PAIR_ADDRESS"
  fi
fi

# Build JSON output
cat <<EOF
{
  "address": "$TOKEN",
  "onchain": {
    "name": "$NAME",
    "symbol": "$SYMBOL",
    "decimals": $DECIMALS,
    "totalSupply": "$TOTAL_SUPPLY"
  },
  "market": {
    "price": $PRICE,
    "priceChange24h": $PRICE_CHANGE_24H,
    "liquidity": $LIQUIDITY,
    "volume24h": $VOLUME_24H,
    "dex": $DEX,
    "mainPair": $PAIR,
    "chartUrl": $CHART_URL
  },
  "links": {
    "basescan": "https://basescan.org/address/$TOKEN"
  }
}
EOF

exit 0
