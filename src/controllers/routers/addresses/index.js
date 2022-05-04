const express = require("express")

const Address = require("../../../models/address")


const router = express.Router();

router.get("/", async (req, res) => {
    // get all addresses in database
    const mongoAddresses = await Address.find({}, { _id: 0, __v: 0 })
    res.status(200).send(mongoAddresses === null ? [] : [...mongoAddresses])
});

module.exports = router