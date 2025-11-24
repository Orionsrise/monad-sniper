const config = {
  rpcUrl: "https://rpc.monad.xyz",
  wsUrl: "wss://rpc.monad.xyz",
  factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // AethonSwap factory (first live DEX)
  routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // AethonSwap router
  buyAmountInEth: "0.05", // Amount of MON per snipe (e.g., 0.05 = $0.05 at current price; start small to test)
  minLiquidityUsd: 1000, // Only snipe pools with at least $1,000 liquidity (avoids tiny/rug pools)
  slippage: 20, // 20% slippage tolerance (safe for volatile launches)
};
module.exports = config;
