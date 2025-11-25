const { ethers } = require('ethers');
require('dotenv').config(); // Load .env
const config = require('./config.js');

console.log("Monad Sniper starting... Waiting for new pools...");

// Real-time websocket for launch
const provider = new ethers.WebSocketProvider(config.wsUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Use from .env

// Uniswap V2 PairCreated event ABI
const PAIR_CREATED_ABI = ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'];

// Compute the topic hash correctly for v6
const PAIR_CREATED_TOPIC = ethers.keccak256(ethers.toUtf8Bytes('PairCreated(address indexed token0, address indexed token1, address pair, uint)'));

async function buyToken(tokenAddress) {
  console.log(`Sniping ${tokenAddress}...`);

  const router = new ethers.Contract(
    config.routerAddress,
    ["function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) external payable returns (uint[] memory amounts)"],
    wallet
  );

  const path = ["0x0000000000000000000000000000000000000000", tokenAddress]; // MON native to token
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const amountOutMin = 0; // Slippage handled by router

  try {
    const tx = await router.swapExactETHForTokens(
      amountOutMin,
      path,
      wallet.address,
      deadline,
      { value: ethers.parseEther(config.buyAmountInEth), gasLimit: 500000, gasPrice: ethers.parseUnits("1", "gwei") }
    );
    console.log(`Snipe TX: https://explorer.monad.xyz/tx/${tx.hash}`);
  } catch (error) {
    console.log("Snipe error:", error.message);
  }
}

// Subscribe to logs for PairCreated events from the factory
const filter = {
  address: config.factoryAddress,
  topics: [PAIR_CREATED_TOPIC]
};

provider.on(filter, async (log) => {
  console.log("NEW POOL FOUND!");

  // Parse the event log to extract token0 and token1
  const iface = new ethers.Interface(PAIR_CREATED_ABI);
  const decoded = iface.parseLog(log);
  const token0 = decoded.args.token0;
  const token1 = decoded.args.token1;

  // Assume we snipe the non-native token (e.g., new memecoin); adjust logic if needed
  const tokenAddress = (token0 === "0x0000000000000000000000000000000000000000") ? token1 : token0;
  console.log(`Extracted token: ${tokenAddress}`);

  const pairAddress = decoded.args.pair;  // From the event

  // Get reserves to check liquidity
  const pair = new ethers.Contract(pairAddress, ['function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'], provider);
  const reserves = await pair.getReserves();
  const reserve0 = reserves[0];
  const reserve1 = reserves[1];

  // Assume reserve0 is MON; calculate USD equiv (use oracle or approx; here assume MON ~$0.025)
  const monReserve = (token0 === "0x0000000000000000000000000000000000000000") ? reserve0 : reserve1;
  const liquidityUsd = Number(ethers.formatEther(monReserve)) * 0.025 * 2;  // Approx total liquidity in USD

  if (liquidityUsd < config.minLiquidityUsd) {
    console.log(`Skipping low liquidity pool (${liquidityUsd} USD < ${config.minLiquidityUsd} min)`);
    return;
  }

  // Then proceed to buyToken...
  await buyToken(tokenAddress);
});

// Debug log to confirm provider connection (every 30s)
setInterval(async () => {
  try {
    const block = await provider.getBlockNumber();
    console.log(`Provider connected - Current block: ${block}`);
  } catch (error) {
    console.log("Provider connection error:", error.message);
  }
}, 30000);

console.log("Sniper LIVE – watching for PairCreated events...");
