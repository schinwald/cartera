async function Send(req, res, next) {
    if (req.body.wallet === undefined || req.body.wallet.name === undefined || req.body.recipient === undefined || req.body.recipient.address === undefined || req.body.amount === undefined) {
        res.status(400).send()
        next()
    }

    res.locals.wallet = req.body.wallet
    res.locals.senders = [{
        wallet_name: req.body.wallet.name,
        wallet_token: process.env.BLOCKCYPHER_API_KEY
    }]
    res.locals.receivers = [{
        addresses: [ req.body.recipient.address ],
        value: req.body.amount
    }]
    next()
}

module.exports = Send