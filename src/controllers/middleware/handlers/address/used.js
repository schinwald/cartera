const Wallet = require("../../../../models/wallet")
const Address = require("../../../../models/address")

async function Used(req, res, next) {
    if (res.locals.used === false || res.locals.used === undefined) next()

    // find address information
    const mongoAddressOld = await Address.findOne({ value: res.locals.address }, { owner: 1 }).populate('owner', { name: 1 })

    // generate unique address from API
    const fetchedAddress = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/addrs`, {
            method: 'POST'
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error)
            res.status(500).send()
            next(error)
        })
    
    // add address to wallet
    const fetchedWallet = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/wallets/${mongoAddressOld.owner.name}/addresses?` + new URLSearchParams({
            token: process.env.BLOCKCYPHER_API_KEY
        }), {
            method: 'POST',
            body: JSON.stringify({
                addresses: [ fetchedAddress.address ]
            })
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error)
            res.status(500).send()
            next(error)
        })
    
    // get wallet in database
    const mongoWallet = await Wallet.findOne({ name: fetchedWallet.name })

    // populate address model
    const mongoAddressNew = new Address({
        value: fetchedAddress.address,
        keys: {
            private: fetchedAddress.private,
            public: fetchedAddress.public
        },
        owner: mongoWallet._id
    })

    // push new address to wallet
    mongoWallet.addresses.push(mongoAddressNew)

    // save address to database
    mongoAddressNew.save(error => {
        if (error) {
            res.status(500).send()
            next(error)
        }
    })

    // save wallet to database
    mongoWallet.save(error => {
        if (error) {
            res.status(500).send()
            next(error)
        }
    })

    res.locals.address = mongoAddressNew.value
    next()
}

module.exports = Used