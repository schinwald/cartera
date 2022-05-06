const express = require("express");

const Address = require("../../../models/address")


const router = express.Router();

router.get("/:address", async (req, res) => {
    let mongoAddress = await Address.findOne({ value: req.params.address }).populate('transactions')

    // fetch address from API if it doesn't exist in our database or if it is stale
    if (mongoAddress === null || Date.now() - mongoAddress.updatedAt().getTime() > 180000) {
        // fetch address
        const fetchedAddress = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/addrs/${req.params.address}`, {
                method: 'GET',
            })
            .catch(error => {
                res.status(error.status).send()
                next(error)
            })
        
        if (mongoAddress.transactions.length < fetchedAddress.txrefs.length) {
            // get union of transactions
            const transactions = new Set()
            let union = [...mongoAddress.transactions.map(mongoTransaction => mongoTransaction.ref), ...fetchedAddress.txrefs.map(txref => txref.tx_hash)]
            for (const ref of union) {
                transactions.add(ref)
            }
            // subtract one to get differing transactions
            let mongoTransactions = mongoAddress.transactions.map(mongoTransaction => mongoTransaction.ref)
            for (const ref of mongoTransactions) {
                transactions.delete(ref)
            }

            // use difference to get new transactions
            const fetchedTransactions = await fetch(`https://api.blockcypher.com/v1/${process.env.BLOCKCYPHER_COIN}/${process.env.BLOCKCYPHER_CHAIN}/txs/${transactions.join(';')}`, {
                    method: 'GET',
                })
                .catch(error => {
                    res.status(error.status).send()
                    next(error)
                })
            
            transactions = await Promise.all(fetchedTransactions.map(async (fetchedTransaction) => {
                    let mongoTransaction = new Transaction({
                        senders: []
                    })

                    fetchedTransaction
                }))
        }
        
        // update 
        mongoAddress = await Address.findOneAndUpdate({ value: req.params.address }, {
            balance: {
                confirmed: fetchedAddress.balance,
                pending: fetchedAddress.unconfirmed_balance
            }
        })
    }

    res.status(200).send(mongoAddress)
});

module.exports = router