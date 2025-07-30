import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
const authenticate = async (req, res , next)=>{
    dotenv.config()
    const token = req.cookies.token
    if(!token){
        return res.json({message: "unauthorized user"});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch(error){
        return res.json({message: "token missing"})
    }
}

export default authenticate;