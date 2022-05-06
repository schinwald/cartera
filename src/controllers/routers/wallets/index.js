const express = require("express")

const Wallet = require("../../../models/wallet")


const router = express.Router();

router.get("/", async (req, res) => {
    // get all wallets in database
    const mongoWallets = await Wallet.find({}, { _id: 0, __v: 0 })
        .populate({
            path: 'addresses',
            select: { _id: 0, __v: 0, owner: 0, keys: 0 },
            populate: {
                path: 'transactions',
                select: { _id: 0, __v: 0, 'receivers._id': 0, 'senders._id': 0 },
                populate: {
                    path: 'receivers.address senders.address',
                    select: { _id: 0, value: 1 }
                }
            }
        })
    
    res.status(200).send(mongoWallets)
});

module.exports = router