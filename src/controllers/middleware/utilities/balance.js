const Wallet = require("../../../models/wallet")
const Address = require("../../../models/address")

async function Balance(req, res, next) {
    if (res.locals.address === undefined) next()

    // get newly updated address
    const fetchedAddress = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/addrs/${res.locals.address}/balance`, {
            method: 'GET',
        })
        .then(response => response.json())
        .catch(error => {
            res.status(500).send()
            next(error)
        })
    
    // update address in database
    const mongoAddress = await Address.findOneAndUpdate({ value: fetchedAddress.address }, {
            isConfirmed: (fetchedAddress.unconfirmed_balance > 0) ? true : false,
            balance: fetchedAddress.final_balance
        })

    // update wallet in database
    const mongoWallet = await Wallet.findByIdAndUpdate(mongoAddress.owner, {
            $set: { balance: mongoAddress.balance }
        })

    next()
}

module.exports = Balance