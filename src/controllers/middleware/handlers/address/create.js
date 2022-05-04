// models
const Address = require("../../../models/address")

async function Create(req, res, next) {
    if (res.locals.wallet === undefined) {
        res.status(400).send()
        next()
    }

    // generate unique address from API
    const fetchedAddress = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/addrs`, {
            method: 'POST'
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })

    // populate address model
    const mongoAddress = new Address({
        owner: res.locals.wallet,
        value: fetchedAddress.address,
        keys: {
            private: fetchedAddress.private,
            public: fetchedAddress.public
        },
        balance: {
            confirmed: 0,
            pending: 0
        }
    })

    // save address to database
    mongoAddress.save(error => {
        if (error) {
            res.status(500).send()
            next(error)
        }
    })
    
    next()
}

module.exports = Create