

async function Get(req, res, next) {
    if (res.locals.ref === undefined) {
        return
    }

    // get transaction information
    const fetchedTransaction = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/txs/${res.locals.ref}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })

    res.locals.transaction = fetchedTransaction

    next()
}

module.exports = Get