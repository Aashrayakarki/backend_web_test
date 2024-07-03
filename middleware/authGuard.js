const jwt = require('jsonwebtoken');

const authGuard = (req, res, next)=> {
    //check incoming data
    console.log(req.headers); //pass

    //Get authorized data from headers
    const authHeader = req.headers.authorization;

    //check or validate the data
    if (!authHeader){
        return res.status(400).json({
            success: false,
            message: 'Authorization header is missing'
        })
    }

    //Split the data (format: 'Bearer token-sdfgts') - only token
    const token = authHeader.split(' ')[1];

    //If token not found: stop the process (res)
    if (!token || token === ''){
        return res.status(400).json({
            success: false,
            message: 'Token not found'
        })
    }

    //Verify
    try {
        const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedUserData;
        next();
    } catch (error) {
        res.status(400).json(
            {
                success: false,
                message: 'Not Authenticated'
            }
        )
    }

    //If verified: next(function in controller)


    //If not verified: noth auth
}

//Admin Guard
const adminGuard = (req, res, next)=> {
    //check incoming data
    console.log(req.headers); //pass

    //Get authorized data from headers
    const authHeader = req.headers.authorization;

    //check or validate the data
    if (!authHeader){
        return res.status(400).json({
            success: false,
            message: 'Authorization header is missing'
        })
    }

    //Split the data (format: 'Bearer token-sdfgts') - only token
    const token = authHeader.split(' ')[1];

    //If token not found: stop the process (res)
    if (!token || token === ''){
        return res.status(400).json({
            success: false,
            message: 'Token not found'
        })
    }

    //Verify
    try {
        const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedUserData; //user info: id only
        if(!req.user.isAdmin){
            return res.status(400).json({
                success: false,
                message: 'Permission Denied'
            })
        }
        next();
    } catch (error) {
        res.status(400).json(
            {
                success: false,
                message: 'Not Authenticated'
            }
        )
    }

    //If verified: next(function in controller)


    //If not verified: noth auth
}

module.exports={
    authGuard,
    adminGuard
}