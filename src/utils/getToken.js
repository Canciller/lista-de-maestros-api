module.exports = function (req) {
    if (req.cookies.token) return req.cookies.token;
    return null;
};
