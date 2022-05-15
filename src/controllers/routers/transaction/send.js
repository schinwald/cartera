const express = require("express");


const router = express.Router();

router.post("/", async (req, res) => {
    res.status(200).send({
        title: 'Success!',
        messages: ['Money from your wallet will be transfered in approximately 3 minutes. Please visit the "History" section to view all pending transactions.']
    })
});

module.exports = router