# 🎲 Provably Fair Dice Game

A blockchain-integrated provably fair dice game built with **Next.js** for the frontend and **Node.js with Express** for the backend. Players can connect their MetaMask wallet, place bets, and roll the dice with a fair and verifiable outcome.

## 🚀 Live Demo

[Live Game](#) *()*

## 📸 Screenshot

![Game Screenshot](/frontend/public/screenshot.png)

---

## 🛠️ Features

- **Provably Fair System**: Uses client and server seeds to ensure transparency.
- **MetaMask Integration**: Connect wallet and check balance.
- **Real-Time UI Updates**: Dynamic game balance and dice animations.
- **Error Handling & Notifications**: Toast messages for game updates.
- **Local Storage Persistence**: Maintains user balance.

---

## 🏗️ Tech Stack

### Frontend

- **Next.js** (React Framework)
- **TypeScript**
- **Tailwind CSS**
- **React Toastify** for notifications
- **Ethers.js** for blockchain interactions

### Backend

- **Node.js** with **Express.js**
- **Provably Fair Algorithm** for dice rolls

---

## 🔧 Installation & Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/dice-game.git
   cd dice-game
   ```

2. **Install dependencies**

   ```sh
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**

   - Create a `.env` file in the backend directory with:
     ```env
     NODE_SERVER_PORT=8000
     ```
   - Create a `.env` file in the frontend directory with:
     ```env
     NEXT_PUBLIC_API_ENDPOINT=http://localhost:8000
     ```

4. **Run the backend**

   ```sh
   cd backend
   npm start
   ```

5. **Run the frontend**

   ```sh
   cd frontend
   npm run dev
   ```

6. **Access the game** Open `http://localhost:3000` in your browser.

---

## 🔐 How It Works

1. The user enters a bet amount and rolls the dice.
2. The backend generates a dice roll using:
   - A **User Seed** (randomly generated for each roll)
   - A **Server Seed** (hidden until the roll is complete)
3. The game verifies fairness by checking the hash of both seeds.
4. If the dice roll is **4 or higher**, the user wins!
5. The results and hashes are displayed for transparency.

---

## 🛠️ API Endpoints

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| `POST` | `/roll-dice`    | Rolls the dice and returns result |
