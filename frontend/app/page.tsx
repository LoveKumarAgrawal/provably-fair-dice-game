"use client"

import { useState } from 'react';
import DiceLine from '../components/DiceLine';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {

  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState<number>(0)
  const [diceResult, setDiceResult] = useState<number>();
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState('');
  const [userSeed, setUserSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleRollDice = async () => {
    if (!betAmount) {
      toast("Enter some bet amount", {
        position: "top-left",
        autoClose: 3000,
        theme: "dark",
        type: "error"
      })
      return
    }
    if (betAmount > balance) {
      toast("Insuffient balance to place bet", {
        position: "top-left",
        autoClose: 3000,
        theme: "dark",
        type: "error"
      })
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT || ""}/roll-dice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betAmount, balance, userSeed: Math.random().toString(36).substring(2) }),
    });

    const data = await response.json();
    setBetAmount(0)
    setDiceResult(data.result);
    setBalance(data.newBalance);
    setHash(data.hash);
    setUserSeed(data.userSeed);
    setServerSeed(data.serverSeed);
    setMessage(data.result >= 4 ? 'You won!' : 'You lost!');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setBetAmount(value);
    } else {
      setBetAmount(0);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Provably Fair Dice Game</h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Controls (Left on Desktop, Top on Mobile) */}
        <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-lg mb-4">Balance: ${balance}</div>
          <input
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={handleInput}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <button
            onClick={handleRollDice}
            className="w-full p-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Roll Dice
          </button>
          {diceResult && (
            <div className="mt-4 text-center">
              <div className="text-xl">Dice Roll: {diceResult}</div>
              <div className="text-lg text-yellow-400">{message}</div>
            </div>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full p-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Verify
          </button>
          {showDetails && (
            <div className="mt-4 text-sm w-full overflow-hidden break-words gap-4">
              <div className="break-words"><span className="font-bold text-blue-400">Hash: </span>{hash}</div>
              <div className="break-words"><span className="font-bold text-blue-400">User Seed: </span>{userSeed}</div>
              <div className="break-words"><span className="font-bold text-blue-400">Server Seed: </span>{serverSeed}</div>
            </div>
          )}
        </div>

        {/* Dice Line (Right on Desktop, Bottom on Mobile) */}
        <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <DiceLine result={diceResult ?? null} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}