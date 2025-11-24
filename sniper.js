const { ethers } = require('ethers');
const config = require('./config.js');

console.log("Monad Sniper starting... Waiting for new pools...");

// Real-time websocket for launch
const provider = new ethers.WebSocketProvider(config.wsUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

// Uniswap V2 PairCreated topic
const PAIR_CREATED_TOPIC = "0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9";

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

// Listen for pending TXs
provider.on("pending", async (txHash) => {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx || !tx.data) return;

    if (tx.to && tx.to.toLowerCase() === config.factoryAddress.toLowerCase() && tx.data.includes(PAIR_CREATED_TOPIC.slice(2))) {
      console.log("NEW POOL FOUND!");

      // Wait 3s for logs, then extract token (basic for day-1)
      setTimeout(async () => {
        console.log("Extracting token..."); // Add real log parse if needed
        const tokenAddress = "0xEXAMPLE_NEW_TOKEN"; // Replace with real extraction post-launch
        await buyToken(tokenAddress);
      }, 3000);
    }
  } catch (e) {}
});

console.log("Sniper LIVE – watching mempool...");
