const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    alias: {
        type: String,
        required: false
    },
	name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
	addresses: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: true
        }],
        required: true,
        default: []
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

module.exports = mongoose.model("Wallet", WalletSchema)