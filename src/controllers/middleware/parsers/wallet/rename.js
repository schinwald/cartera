async function Rename(req, res, next) {
    if (req.body.wallet === undefined || req.body.wallet.name === undefined || req.body.wallet.alias === undefined) {
        res.status(400).send()
        return
    }

    res.locals.wallet = req.body.wallet
    
    next()
}

module.exports = Rename