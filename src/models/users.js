const mongoose = require('mongoose')

const Wallet = require('./wallet')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	wallet: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        }],
        required: true
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
});

module.export = mongoose.model("User", UserSchema)