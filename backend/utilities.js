// allows creating and verifying JWTs (JSON Web Tokens)
const jwt = require('jsonwebtoken')

// used as middleware in Express routes - It intercepts the request before it reaches the route handler to check if the user is authenticated.
function authenticateToken(req, res, next){
    
    // Authorization headers typically look like this: Authorization: Bearer <token>
    // authHeader.split(" ")[1] extracts the <token> part.
    // If there is no token, token will be undefined.
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);
    
    // checks if the token is valid using a secret key (ACCESS_TOKEN_SECRET from .env file). If invalid or expired, err is not null.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(401);
        
        //If the token is valid, user contains the decoded payload (e.g., { id: 123, email: "abc@example.com" }). The middleware attaches this user info to req.user, making it available to the next handler.
        
        req.user = user
        next()
    })
}

module.exports = {
    authenticateToken,
}