const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const path = require('path')

const Wallet = require('../../../../models/wallet')
const Address = require('../../../../models/address')

async function Sign(req, res, next) {
    if (res.locals.transaction === undefined) {
        res.status(400).send()
        next('error')
    }

    res.locals.transaction.signatures = []
    res.locals.transaction.pubkeys = []

    // extract address values from skeleton transaction
    const addresses = res.locals.transaction.tx.inputs.map(input => input.addresses)
        .reduce((previous, current, index) => {
            if (index === 0) return [...previous]
            return [...previous, ...current]
        })

    // find address values in database
    const mongoWallet = await Wallet.findOne({ name: res.locals.wallet.name }, { _id: 1 })
    const mongoAddresses = await Address.find({ value: { $in: addresses }, owner: mongoWallet._id }, { value: 1, keys: 1 })

    // store address data in hashmap for fast retrieval
    const addressMap = new Map()
    for (const address of mongoAddresses) {
        addressMap.set(address.value, address.keys)
        console.log('assigned ' + address.value + ' to ' + address.keys)
    }
    
    // sign information using same order as skeleton transaction
    for (const i in addresses) {
        const keys = addressMap.get(addresses[i])
        const { stdout, stderr } = await exec(`${path.join(__dirname, "../../../../", "utils/signer")}/signer ${res.locals.transaction.tosign[i]} ${keys.private}`)
        if (stderr) next(stderr)
        res.locals.transaction.signatures.push(stdout.trim())
        res.locals.transaction.pubkeys.push(keys.public)
    }

    console.log("signing...")
    console.log(res.locals.transaction)

    next()
}

module.exports = Sign