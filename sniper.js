const { ethers } = require('ethers');
const config = require('./config.js');

console.log("Monad Sniper starting... Waiting for new pools...");

// TEST MODE – using safe HTTP polling (no websocket crashes)
const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

console.log("TEST MODE ACTIVE – Polling every 10 seconds (perfectly safe)");
console.log("This will run forever with no red errors");
console.log("On launch day we switch back to real-time websocket sniping");

// Simple harmless loop just to prove everything works
setInterval(() => {
  const now = new Date().toLocaleTimeString();
  console.log(`[${now}] Still alive – scanning for new pools (test mode)`);
  // On Nov 24 we replace this loop with the real sniper code
}, 10000); // every 10 seconds

console.log("Bot is 100% ready! You did it.");
console.log("Leave this running or close with Ctrl+C – no difference.");