import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

// routers
import showPageIndex from "./controllers/routers/index.js"
import createWallet from "./controllers/routers/wallet/create.js"
import loadWallet from "./controllers/routers/wallet/load.js"
import getWallets from "./controllers/routers/wallets/index.js"
import getAddress from "./controllers/routers/address/index.js"
import getAddresses from "./controllers/routers/addresses/index.js"
import getQRCode from "./controllers/routers/qrcode/index.js"

// middlewares
import faucetHandler from "./controllers/middleware/handlers/address/faucet.js"
import usedHandler from "./controllers/middleware/handlers/address/used.js"
import balanceUtility from "./controllers/middleware/utilities/balance.js"
import loadParser from "./controllers/middleware/parsers/wallet/load.js"

// connect to database
await mongoose.connect('mongodb://localhost/test');

// setup router endpoints
const app = express();

app.use("/", showPageIndex);
app.use("/wallet/create", createWallet);
app.use("/wallet/load", bodyParser.json(), loadParser, faucetHandler, loadWallet);
app.use("/wallets", getWallets);
app.use("/address", getAddress);
app.use("/addresses", getAddresses);
app.use("/qrcode", getQRCode);

// start the server on specified port
app.listen(8080, () => {
    console.log(`server started at http://localhost:8080`);
});