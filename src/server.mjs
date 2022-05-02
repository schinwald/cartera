import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from 'mongoose'

import showPageIndex from "./controllers/routers/index.js"
import getWallet from "./controllers/routers/wallet/index.js"
import createWallet from "./controllers/routers/wallet/create.js"
import getWallets from "./controllers/routers/wallets/index.js"

// connect to database
await mongoose.connect('mongodb://localhost/test');

// setup router endpoints
const app = express();

app.use("/", showPageIndex);
app.use("/wallet", getWallet);
app.use("/wallet/create", createWallet);
app.use("/wallets", getWallets);

// start the server on specified port
app.listen(8080, () => {
    console.log(`server started at http://localhost:8080`);
});