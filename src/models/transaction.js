const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    ref: {
        type: String,
        required: true
    },
    confirmations: {
        type: Number,
        required: true
    },
    senders: {
        type: [{
            address: {
                type: Schema.Types.ObjectId,
                ref: 'Address',
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }],
        required: true,
        default: []
    },
    receivers: {
        type: [{
            address: {
                type: Schema.Types.ObjectId,
                ref: 'Address',
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }],
        required: true,
        default: []
    }
})

module.exports = mongoose.model("Transaction", TransactionSchema)