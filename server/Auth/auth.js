import jwt from 'jsonwebtoken';

export const myAuth = (req, res, next) =>{
    const allowedUrls = ['/users/register', '/users/login'];
    const url = req.url;

    if(allowedUrls.includes(url)){
        next();
    }
    else{
        const bearerToken = req.headers.authorization;
        if(bearerToken){
            const token = bearerToken.split(" ")[1];
            try{
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                req.id = payload.id;
                next();
            }
            catch(err){
                res.status(400).json({
                    success: false,
                    message: "Un Authorize Access / Token is invalid"
                })
            }
        }

        else{
            res.status(400).json({
                success: false,
                message:"Token is missing"
            })
        }
    }

}