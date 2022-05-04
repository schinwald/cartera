const Transaction = require('../../../../models/transaction')
const Address = require('../../../../models/address')
const { fabClasses } = require('@mui/material')

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

    // populate transaction model
    const mongoTransaction = new Transaction({
        ref: fetchedTransaction.hash,
        confirmations: fetchedTransaction.confirmations,
        senders: [],
        receivers: []
    })
    
    // create or update output addresses in database depending on if it exists
    for (const output of fetchedTransaction.outputs) {
        for (const address of output.addresses) {
            let mongoAddress = await Address.findOne({ value: address })
            
            if (mongoAddress === null) {
                mongoAddress = new Address({
                    value: address,
                    transactions: [ mongoTransaction._id ]
                })
            } else {
                if (mongoAddress.balance !== undefined && mongoAddress.balance.pending !== undefined) {
                    mongoAddress.balance.pending += output.value
                }
                mongoAddress.transactions.push(mongoTransaction._id)
            }

            // save transaction to database
            await mongoAddress.save()
            
            mongoTransaction.receivers.push({
                    address: mongoAddress._id,
                    amount: output.value
                })
        }
    }

    // create or update input addresses in database depending on if it exists
    for (const input of fetchedTransaction.inputs) {
        for (const address of input.addresses) {
            let mongoAddress = await Address.findOne({ value: address })
            
            if (mongoAddress === null) {
                mongoAddress = new Address({
                    value: address,
                    transactions: [ mongoTransaction._id ]
                })
            } else {
                if (mongoAddress.balance && mongoAddress.balance.pending) {
                    mongoAddress.balance.pending -= input.output_value
                }
                mongoAddress.transactions.push(mongoTransaction._id)
            }
            
            // save transaction to database
            await mongoAddress.save()
            
            mongoTransaction.senders.push({
                    address: mongoAddress._id,
                    amount: input.output_value
                })
        }
    }

    // save transaction to database
    mongoTransaction.save(error => {
        if (error) {
            res.status(500).send()
            next(error)
        }
    })

    next()
}

module.exports = Faucet