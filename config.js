require('dotenv').config();
const { ethers } = require('ethers');

const config = {
rpcUrl: "https://rpc.monad.xyz",
wsUrl: "wss://rpc.monad.xyz",
factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",  // AethonSwap factory (first live DEX)
routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",  // AethonSwap router
buyAmountInEth: "0.01",  // Tiny snipes to start

  // How much MON (or ETH on Monad) to spend per snipe
  buyAmountInEth: "0.05",        // ← 0.05 MON per snipe (you can lower to 0.01)
  
  // Only snipe pools that have at least this much liquidity
  minLiquidityUsd: 5000,         // $5,000 minimum (avoids scams)

  // Slippage protection
  slippage: 20,                  // 20% is safe for wild launch
};

module.exports = config;
