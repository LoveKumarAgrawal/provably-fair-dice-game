import express from "express"
import 'dotenv/config'
import crypto from "crypto"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.NODE_SERVER_PORT || 3000;

function generateHash(userSeed, serverSeed) {
    const data = userSeed + serverSeed;
    return crypto.createHash('sha256').update(data).digest('hex');
}

app.post("/roll-dice", (req, res) => {
    const { betAmount, balance, userSeed } = req.body;
    
    if (!userSeed) {
        return res.status(400).json({ error: 'User seed is required.' });
    }

    const serverSeed = crypto.randomBytes(32).toString("hex");

    const hash = generateHash(userSeed, serverSeed);

    // Use the hash to deterministically calculate the dice roll (map part of the hash to the range 1-6)
    const rollResult = parseInt(hash.slice(0, 8), 16) % 6 + 1;  // Map the first 8 characters of the hash to 1-6

    const outcome = rollResult >= 4 ? "win" : "lose";

    let newBalance = balance;
    if (outcome === "win") {
        newBalance += betAmount * 2;
    } else {
        newBalance -= betAmount;
    }

    return res.status(200).json({
        newBalance,
        result: rollResult,
        hash,
        userSeed,
        serverSeed
    });
});



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
