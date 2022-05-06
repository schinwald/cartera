const express = require("express")

const Address = require("../../../models/address")


const router = express.Router();

router.get("/", async (req, res) => {
    // get all addresses in database
    const mongoAddresses = await Address.find({}, { value: 1 }).lean()
    res.status(200).send(mongoAddresses === null ? [] : mongoAddresses.map(mongoAddress => mongoAddress.value))
});

module.exports = router