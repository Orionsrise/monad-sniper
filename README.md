# Free Monad Sniper Bot 🚀

Auto-snipes every new memecoin pool on Monad mainnet from block 1.

## How to use (takes 2 minutes)
1. Download the repo (green Code button → Download ZIP)
2. Open terminal in the folder → type `npm install`
3. Copy `config.js.example` to `config.js` and update RPC/factory/router tomorrow
4. Add your private key to `.env` (never share this file!)
5. Run `node sniper.js`

No fees, no rug, fully open-source.  
Tested and ready for November 24 launch.

Tips are super appreciated (helps me keep it free):  
**0xF1dAcA98a25Af7ccd2199071f679F8669f34bf48**

Full token extraction update coming when first DEX drops.

#Monad #MainnetLaunch

*******************************************************

Core Function: It monitors the Monad blockchain's mempool (pending transactions) in real-time for new liquidity pool creations on a DEX (like a Uniswap V2 fork, e.g., Likwid or Aethon on Monad). When it detects a new pair (e.g., a new memecoin paired with MON or ETH), it automatically attempts to buy a small amount of the new token using your wallet's funds (e.g., 0.01 MON per snipe, configurable in config.js).

How It Works Under the Hood:
* Connects to Monad's RPC (remote procedure call) endpoint to listen for "PairCreated" events from the DEX factory contract.
* When a new pool is detected, it executes a swap via the DEX router contract (e.g., swap MON for the new token with slippage tolerance).
* Logs everything to the console: detections, buy attempts, transaction hashes (viewable on the Monad explorer), and errors (e.g., if gas is too high or slippage fails).
* It's designed for day-1 mainnet chaos—aims to front-run other traders by buying early, potentially capturing low-entry prices on new tokens before they pump (or dump).

Key Benefits for Users: 
Gives an edge to degens hunting early memecoins/airdrops without manual monitoring. Free, customizable (e.g., change buy amount or add filters for specific tokens), and EVM-compatible so it works on Monad's parallelized chain.

Currently, this will only run in your terminal. If all goes well, we'll launch a UI dashboard.

Risks: 
It's a degen tool—could lose money on bad snipes (rugs, dumps), impermanent loss, or high gas. No guarantees; users should start with tiny amounts.
