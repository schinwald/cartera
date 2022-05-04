const Wallet = require("../../../../models/wallet")
const Address = require("../../../../models/address")

async function Load(req, res, next) {
    if (req.body.address === undefined || req.body.amount === undefined) {
        res.status(400).send()
        next()
    }

    res.locals.address = req.body.address
    res.locals.amount = req.body.amount
    
    next()
}

module.exports = Load