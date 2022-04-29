const dotenv = require("dotenv").config()
const express = require("express");

const showPageIndex = require("./routers/index.js");
const getWallet = require("./routers/wallet/index.js");
const createWallet = require("./routers/wallet/create.js");

const app = express();

app.use("/", showPageIndex);
app.use("/wallet", getWallet);
app.use("/wallet/create", createWallet);

// start the server on specified port
app.listen(8080, () => {
    console.log(`server started at http://localhost:8080`);
});