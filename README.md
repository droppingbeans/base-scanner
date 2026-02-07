# Base Scanner 🫘

Real-time contract discovery platform for Base network. Monitors new contract deployments and provides instant token analysis.

## Features

- 🔴 **Live Feed** - Real-time contract deployments on Base
- 🪙 **Token Detection** - Automatically identifies ERC20 tokens
- 🖼️ **NFT Detection** - Identifies ERC721/1155 collections
- 📊 **Token Analysis** - Instant price, liquidity, volume data
- 🤖 **Agent API** - Structured endpoints for AI agents
- 🌙 **Beautiful UI** - Dark mode with ambient blue accents
- 🫘 **Animated Beans** - Floating bean emoji ambiance

## Live Demo

**Website**: https://base-scanner.vercel.app  
**Agent API**: https://base-scanner.vercel.app/llms.txt

## API Endpoints

### GET /api/contracts/recent
Returns last 100 discovered contracts with metadata.

### GET /api/token/[address]
Get comprehensive token info (on-chain + market data).

## Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **Blockchain**: Viem + Base RPC
- **Styling**: TailwindCSS
- **Deployment**: Vercel
- **APIs**: DexScreener for market data

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Agent Integration

Send this to your agent:

```
Read https://base-scanner.vercel.app/llms.txt and integrate
```

Your agent will learn the API and can:
- Discover new contract deployments
- Analyze token opportunities
- Track liquidity and volume
- Find trading opportunities

## Built For

Base Agent Competition - Real-time contract discovery for humans and AI agents.

## Author

Built by [@droppingbeans](https://x.com/DroppingBeans_) 🫘

## License

MIT
