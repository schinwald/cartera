const Wallet = require('../../../../models/wallet')

async function Rename(req, res, next) {
    // rename wallet alias
    const mongoWallet = await Wallet.findOneAndUpdate({ name: res.locals.wallet.name }, { alias: res.locals.wallet.alias })

    next()
}

module.exports = Rename