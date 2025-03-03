"use client";

import { useState, useEffect } from "react";
import DiceLine from "../components/DiceLine";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";

declare global {
  interface Window{
    ethereum?: ""
  }
}

const INITIAL_BALANCE = 1000;

const DiceGame = () => {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [walletBalance, setWalletBalance] = useState("0");
  const [account, setAccount] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  
  // Grouped game details
  const [gameDetails, setGameDetails] = useState({
    hash: "",
    userSeed: "",
    serverSeed: "",
  });

  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    if (storedBalance) setBalance(Number(storedBalance));
  }, []);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  const notify = (message: string, type: "success" | "error") => {
    toast(message, { type, theme: "dark" });
  };

  const connectWallet = async () => {
    if (!window.ethereum) return notify("MetaMask not detected!", "error");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      setWalletBalance(ethers.formatEther(await provider.getBalance(signer.address)));
    } catch {
      notify("Wallet connection failed!", "error");
    }
  };

  const handleRollDice = async () => {
    if (!betAmount) return notify("Enter a bet amount", "error");
    if (betAmount > balance) return notify("Insufficient balance", "error");

    setIsRolling(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT || ""}/roll-dice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betAmount, balance, userSeed: Math.random().toString(36).substring(2) }),
      });
      
      const data = await response.json();
      setIsRolling(false);
      setBetAmount(0);
      setDiceResult(data.result);
      setBalance(data.newBalance);
      setGameDetails({ hash: data.hash, userSeed: data.userSeed, serverSeed: data.serverSeed });
      setMessage(data.result >= 4 ? "You won!" : "You lost!");
    } catch {
      notify("Error rolling dice. Please try again.", "error");
    }
  };

  const resetGame = () => {
    setBalance(INITIAL_BALANCE);
    setBetAmount(0);
    setDiceResult(null);
    setMessage("");
    setGameDetails({ hash: "", userSeed: "", serverSeed: "" });
    localStorage.setItem("balance", INITIAL_BALANCE.toString());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Provably Fair Dice Game</h1>
      <button onClick={connectWallet} className="p-2 mb-4 bg-purple-600 rounded">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>
      <div className="mb-4">Wallet Balance: {walletBalance} ETH</div>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-lg mb-4">Game Balance: ${balance}</div>
          <input
            type="text"
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value) || 0)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <button onClick={handleRollDice} className="w-full p-2 bg-green-600 rounded" disabled={isRolling || balance === 0}>
            {isRolling ? "Rolling..." : "Roll Dice"}
          </button>
          {balance === 0 && (
            <button onClick={resetGame} className="w-full p-2 mt-4 bg-red-600 rounded">
              Reset Game
            </button>
          )}
          {diceResult !== null && (
            <div className="mt-4 text-center">
              <div className="text-xl">Dice Roll: {diceResult}</div>
              <div className="text-lg text-yellow-400">{message}</div>
            </div>
          )}
          <button onClick={() => setShowDetails(!showDetails)} className="w-full p-2 mt-4 bg-blue-600 rounded" disabled={isRolling}>
            Verify
          </button>
          {showDetails && (
            <div className="mt-4 text-sm break-words">
              <div><span className="font-bold text-blue-400">Hash: </span>{gameDetails.hash}</div>
              <div><span className="font-bold text-blue-400">User Seed: </span>{gameDetails.userSeed}</div>
              <div><span className="font-bold text-blue-400">Server Seed: </span>{gameDetails.serverSeed}</div>
            </div>
          )}
        </div>
        <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <DiceLine result={diceResult ?? null} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DiceGame;