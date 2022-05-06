const express = require("express");


const router = express.Router();

router.post("/", async (req, res) => {
    res.status(201).send()
});

module.exports = router