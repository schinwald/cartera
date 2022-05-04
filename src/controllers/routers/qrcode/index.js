const express = require("express");
var qrcode = require('qrcode')


const router = express.Router();

router.get("/", async (req, res) => {
    if (req.query.data === undefined) {
        res.status(400).send()
        return
    }

    const url = await qrcode.toDataURL(req.query.data)
        .catch(error => {
            res.status(500).send()
        })
    
    res.status(200).send({ url: url })
});

module.exports = router