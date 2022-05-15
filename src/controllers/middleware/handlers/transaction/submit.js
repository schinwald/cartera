

async function Submit(req, res, next) {
    // create new transaction from API
    const fetchedTransaction = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/txs/send?` + new URLSearchParams({
            token: process.env.BLOCKCYPHER_API_KEY
        }), {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(res.locals.transaction)
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })

    console.log("submitting...")
    console.log(fetchedTransaction)

    if (fetchedTransaction.errors !== undefined) {
        res.status(400).send({
            title: 'Unable to finalize transaction!',
            messages: fetchedTransaction.errors.map(json => json.error)
        })
        return
    }

    res.locals.transaction = fetchedTransaction.tx
    next()
}

module.exports = Submit