async function Create(req, res, next) {
    if (res.locals.senders === undefined || res.locals.receivers === undefined) {
        next()
    }

    // create new transaction from API
    const fetchedTransaction = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/txs/new?` + new URLSearchParams({
            token: process.env.BLOCKCYPHER_API_KEY
        }), {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                inputs: res.locals.senders,
                outputs: res.locals.receivers
            })
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })

    console.log("creating...")
    console.log(fetchedTransaction)
    
    if (fetchedTransaction.errors !== undefined) {
        res.status(400).send({
            title: 'Unable to create transaction!',
            messages: fetchedTransaction.errors.map(json => json.error)
        })
        return
    }

    res.locals.transaction = fetchedTransaction
    
    next()
}

module.exports = Create