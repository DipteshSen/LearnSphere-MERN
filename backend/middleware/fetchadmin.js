const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET || 'MonkeyDLuffy'

const fetchAdmin= (req, res, next) => {
    const token = req.header('auth-token');

    if(!token){
        return res.status(401).json({message: 'Login required'});
    }

    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.admin = data.admin;
        next();
    } catch(err){
        console.error(err.message);
        return res.status(500).json({message: 'Server Error'});
    }
}

module.exports = fetchAdmin;