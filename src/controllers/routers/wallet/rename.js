const express = require("express")

const router = express.Router()

router.put("/", (req, res) => {
    res.status(200).send({ message: 'Successfully renamed wallet!' })
});

module.exports = router