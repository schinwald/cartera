const express = require("express");


const router = express.Router();

router.post("/", async (req, res) => {
    res.status(200).send({ success: 'money transfered' })
});

module.exports = router