const express = require("express")
const fetch = require("isomorphic-fetch")
const uniqid = require("uniqid")

// models
const Address = require("../../../models/address")
const Wallet = require("../../../models/wallet")

const router = express.Router();

router.post("/", async (req, res) => {
    if (req.query.alias === undefined) {
        res.status(400).send()
        return
    }

    // generate unique address from API
    const fetchedAddress = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/addrs`, {
            method: 'POST'
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error)
            res.status(500).send()
        })
    
    // create wallet with newly generated name and previously generated address
    const fetchedWallet = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/wallets?` + new URLSearchParams({
            token: process.env.BLOCKCYPHER_API_KEY
        }), {
            method: 'POST',
            body: JSON.stringify({
                name: uniqid('wallet-').substring(0, 25),
                addresses: [ fetchedAddress.address ]
            })
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error)
            res.status(500).send()
        })

    // populate address model
    const address = new Address({
        value: fetchedAddress.address,
        keys: {
            private: fetchedAddress.private,
            public: fetchedAddress.public
        }
    })

    // populate wallet model
    const wallet = new Wallet({
        alias: req.query.alias,
        name: fetchedWallet.name,
        addresses: [ address._id ],
        balance: 0
    })

    // save address to database
    address.save(error => {
        if (!error) {
            console.log("Address Saved!")
        } else {
            console.error(error)
            res.status(500).send()
        }
    })

    // save address to database
    wallet.save(error => {
        if (!error) {
            console.log("Wallet Saved!")
        } else {
            console.error(error)
            res.status(500).send()
        }
    })
    
    res.status(201).send()
});

module.exports = router