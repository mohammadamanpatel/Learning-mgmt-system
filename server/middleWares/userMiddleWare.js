import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    try {
        //extract token
        console.log("from cookie", req.cookies.jwtToken);
        const jwtToken = req.cookies.jwtToken || req.body.jwtToken;
        console.log("jwtToken--:>", jwtToken);
        //if token missing, then return response
        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
                jwtToken: jwtToken
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (err) {
            //verification - issue
            console.log(err);
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
                error: err.message
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
            error: error.message
        });
    }
}
const isAdmin = async function (req, res, next) {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(400).json({
                success: false,
                message: "This route is for Course Admin Only"
            })
        }
        else {
            next();
        }
    }
    catch (Error) {
        console.log(Error.message);
        return res.status(500).json({
            success: false,
            message: Error.message
        })
    }
}
const authorizeSubscribers = async (req, res, next) => {
    try {
        // If user is not admin or does not have an active subscription then error else pass
        if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
            return res.status(403).json({
                message: "Please subscribe to access this route."
            })
        }
    }
    catch (error) {
     console.log("error in authorizeSubscribers section",error);
    }
    next()
};
export {
    isLoggedIn,
    isAdmin,
    authorizeSubscribers
}