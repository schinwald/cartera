const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// https://www.blockcypher.com/dev/bitcoin/#generate-address-endpoint
// specification says to NOT store private keys for long periods of time
const AddressSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: false
    },
    value: {
        type: String,
        required: true
    },
    keys: {
        private: {
            type: String,
            required: false // eventually private keys should be removed for confidentiality purposes
        },
        public: {
            type: String,
            required: false
        },
        required: false
    },
    balance: {
        confirmed: {
            type: Number,
            required: false
        },
        pending: {
            type: Number,
            required: false
        }
    },
    transactions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true
        }],
        required: true,
        default: []
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => Date.now()
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now()
    }
})

AddressSchema.pre(/update/, function () {
    let data = this.getUpdate()
    data.updatedAt = Date.now()
    this.update({}, data).exec()
    next()
})

module.exports = mongoose.model("Address", AddressSchema)