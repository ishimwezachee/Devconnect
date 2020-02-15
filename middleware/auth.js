const jwt = require("jsonwebtoken");
const config = require('config');

module.exports = (req,res,next)=>{
    // get the token from header 
    const token = req.header('x-auth-token');
    // check if no token ;
    if(!token){
        return res.status(401).json({msg:"No token found"});
    }
    // verify token 

    try {
        const decoded = jwt.verify(token,config.get("jwtSecret"));
        req.tokenData = decoded;
        next();
    } catch (error) {
        res.status(401).json({msg:"token is not valid"})
    }
}