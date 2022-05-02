const express = require("express")

const Wallet = require("../../../models/wallet")

const router = express.Router();

router.get("/", async (req, res) => {
    const wallets = await Wallet.find({}, { _id: 0, __v: 0 }).populate('addresses', { _id: 0, __v: 0 })
    // // check if any wallet needs to be updated
    // for (let wallet of wallets) {
    //     if (wallet.updatedAt.getTime() + 1800 <= Date.now().getTime()) {
    //         const fetchedWallets = fetch(``)
    //     }
    // }
    res.status(200).send(wallets)
});

module.exports = router