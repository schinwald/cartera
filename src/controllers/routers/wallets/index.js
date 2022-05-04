const express = require("express")

const Wallet = require("../../../models/wallet")


const router = express.Router();

router.get("/", async (req, res) => {
    // get all wallets in database
    const mongoWallets = await Wallet.find({}, { _id: 0, __v: 0 })
        .populate('addresses', { _id: 0, __v: 0, owner: 0, keys: 0, used: 0 })
    res.status(200).send(mongoWallets)
});

module.exports = router