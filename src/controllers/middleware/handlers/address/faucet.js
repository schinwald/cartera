async function Faucet(req, res, next) {
    // use faucet to load money into address of wallet
    const fetchedTransactionRef = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/faucet?` + new URLSearchParams({
            token: process.env.BLOCKCYPHER_API_KEY
        }), {
            method: 'POST',
            body: JSON.stringify({
                address: res.locals.address,
                amount: res.locals.amount
            })
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })
    
    // get transaction information
    const fetchedTransaction = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/txs/${fetchedTransactionRef.tx_ref}`, {
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

module.exports = Faucet