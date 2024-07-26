exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        return res.send("Access Denied").status(401)
    }
}