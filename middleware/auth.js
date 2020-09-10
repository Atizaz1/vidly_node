const Jwt = require('jsonwebtoken');

module.exports = function(req, res, next)
{
    const authHeader = req.header('Authorization');

    if(!authHeader)
    {
        return res.status(401).send('Access Denied. No Token Provided');
    }

    const token = authHeader.split(' ');

    try
    {
        const decodedPayLoad = Jwt.verify(token[1], process.env.JWT_SECRET);
        req.user = decodedPayLoad;
        next();
    }
    catch (ex)
    {
        res.status(400).send('Invalid Token');
    }
}