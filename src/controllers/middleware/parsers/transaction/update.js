async function Update(req, res, next) {
    if (req.body.ref === undefined) {
        res.status(400).send()
        return
    }

    res.locals.ref = req.body.ref

    next()
}

module.exports = Update