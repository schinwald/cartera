const Transaction = require('../../../../models/transaction')
const Address = require('../../../../models/address')

async function Save(req, res, next) {
    if (res.locals.transaction === undefined) {
        return
    }

    let mongoTransaction = await Transaction.findOne({ ref: res.locals.transaction.hash })
    let isNewTransaction = false;

    // populate transaction model
    if (mongoTransaction === null) {
        mongoTransaction = new Transaction({
            ref: res.locals.transaction.hash,
            fees: res.locals.transaction.fees,
            confirmations: res.locals.transaction.confirmations,
            senders: [],
            receivers: []
        })
        isNewTransaction = true
    } else {
        mongoTransaction.fees = res.locals.transaction.fees,
        mongoTransaction.confirmations = res.locals.transaction.confirmations,
        mongoTransaction.senders = []
        mongoTransaction.receivers = []
    }
    
    // create or update output addresses in database depending on if it exists
    for (const output of res.locals.transaction.outputs) {
        for (const address of output.addresses) {
            let mongoAddress = await Address.findOne({ value: address })
            
            if (mongoAddress === null) {
                mongoAddress = new Address({
                    value: address,
                    transactions: [ mongoTransaction._id ]
                })
            } else {
                if (mongoAddress.balance !== undefined && mongoAddress.balance.pending !== undefined && mongoAddress.balance.confirmed !== undefined) {
                    if (isNewTransaction) {
                        mongoAddress.balance.pending += output.value
                    } else {
                        if (res.locals.transaction.confirmations >= 6) {
                            mongoAddress.balance.pending -= output.value
                            mongoAddress.balance.confirmed += output.value
                        }
                    }
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
    for (const input of res.locals.transaction.inputs) {
        for (const address of input.addresses) {
            let mongoAddress = await Address.findOne({ value: address })
            
            if (mongoAddress === null) {
                mongoAddress = new Address({
                    value: address,
                    transactions: [ mongoTransaction._id ]
                })
            } else {
                if (mongoAddress.balance !== undefined && mongoAddress.balance.pending !== undefined && mongoAddress.balance.confirmed !== undefined) {
                    if (isNewTransaction) {
                        mongoAddress.balance.pending -= input.output_value
                    } else {
                        if (res.locals.transaction.confirmations >= 6) {
                            mongoAddress.balance.pending += input.output_value
                            mongoAddress.balance.confirmed -= input.output_value
                        }
                    }
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

    res.locals.used = true

    next()
}

module.exports = Save