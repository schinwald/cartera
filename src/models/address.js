const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// https://www.blockcypher.com/dev/bitcoin/#generate-address-endpoint
// specification says to NOT store private keys for long periods of time
const AddressSchema = new Schema({
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
            required: true
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now()
    }
})

module.exports = mongoose.model("Address", AddressSchema)