const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const path = require('path')

const Wallet = require('../../../../models/wallet')

async function Sign(req, res, next) {
    if (res.locals.transaction === undefined) {
        res.status(400).send()
        next('error')
    }

    res.locals.transaction.signatures = []
    res.locals.transaction.pubkeys = []

    const mongoWallet = await Wallet.findOne({ name: res.locals.wallet.name }, { addresses: 1 }).populate('addresses')
    for (const address of mongoWallet.addresses) {
        const { stdout, stderr } = await exec(`${path.join(__dirname, "../../../../", "utils/signer")}/signer ${res.locals.transaction.tosign[0]} ${address.keys.private}`)
        if (stderr) next(stderr)
        res.locals.transaction.signatures.push(stdout.trim())
        res.locals.transaction.pubkeys.push(address.keys.public)
    }

    next()
}

module.exports = Sign