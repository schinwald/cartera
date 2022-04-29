const express = require("express");
const path = require("path");

const router = express.Router();

router.use(express.static(path.join(__dirname, "../..", "build")));

router.get("/", (req, res) => {
    res.sendFile('index.html');
});

module.exports = router