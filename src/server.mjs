import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

// routers
import renderHomePage from "./controllers/routers/index.js"
import createWallet from "./controllers/routers/wallet/create.js"
import loadWallet from "./controllers/routers/wallet/load.js"
import renameWallet from "./controllers/routers/wallet/rename.js"
import getWallets from "./controllers/routers/wallets/index.js"
import getAddress from "./controllers/routers/address/index.js"
import getAddresses from "./controllers/routers/addresses/index.js"
import getQRCode from "./controllers/routers/qrcode/index.js"
import sendTransaction from "./controllers/routers/transaction/send.js"
import updateTransaction from "./controllers/routers/transaction/update.js"

// middlewares
import faucetAddressHandler from "./controllers/middleware/handlers/address/faucet.js"
import usedAddressHandler from "./controllers/middleware/handlers/address/used.js"
import renameWalletHandler from './controllers/middleware/handlers/wallet/rename.js'
import createTransactionHandler from "./controllers/middleware/handlers/transaction/create.js"
import signTransactionHandler from "./controllers/middleware/handlers/transaction/sign.js"
import submitTransactionHandler from "./controllers/middleware/handlers/transaction/submit.js"
import getTransactionHandler from "./controllers/middleware/handlers/transaction/index.js"
import saveTransactionHandler from "./controllers/middleware/handlers/transaction/save.js"

import loadWalletParser from "./controllers/middleware/parsers/wallet/load.js"
import renameWalletParser from "./controllers/middleware/parsers/wallet/rename.js"
import sendTransactionParser from "./controllers/middleware/parsers/transaction/send.js"
import updateTransactionParser from "./controllers/middleware/parsers/transaction/update.js"

// connect to database
await mongoose.connect('mongodb://localhost/test');

// setup router endpoints
const app = express();

app.use(cors()) // enable cors for each endpoint
app.use("/", renderHomePage);
app.use("/wallet/create", createWallet);
app.use("/wallet/load", bodyParser.json(), loadWalletParser, faucetAddressHandler, saveTransactionHandler, usedAddressHandler, loadWallet);
app.use("/wallet/rename", bodyParser.json(), renameWalletParser, renameWalletHandler, renameWallet);
app.use("/wallets", getWallets);
app.use("/address", getAddress);
app.use("/addresses", getAddresses);
app.use("/qrcode", getQRCode);
app.use("/transaction/send", bodyParser.json(), sendTransactionParser, createTransactionHandler, signTransactionHandler, submitTransactionHandler, saveTransactionHandler, sendTransaction);
app.use("/transaction", bodyParser.json(), updateTransactionParser, getTransactionHandler, saveTransactionHandler, updateTransaction);

// start the server on specified port
app.listen(8080, () => {
    console.log(`server started at http://localhost:8080`);
});