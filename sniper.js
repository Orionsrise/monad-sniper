const { ethers } = require('ethers');
const config = require('./config.js');

console.log("Monad Sniper starting... Waiting for new pools...");

// Real-time websocket for launch
const provider = new ethers.WebSocketProvider(config.wsUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

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

  await buyToken(tokenAddress);
});

console.log("Sniper LIVE – watching for PairCreated events...");
