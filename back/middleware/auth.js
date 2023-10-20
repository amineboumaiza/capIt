const jwt = require("jsonwebtoken")

const config = process.env

const verifyToken = (req, res, next) => {
  //console.log(req)
  const token =
    req.headers.token || req.config || req.query.token || req.params.token || req.headers["x-access-token"] || req.rawHeaders.token
    
  if (!token) {
    return res.status(403).json({isValid: false})
  } 
  try {
    const decoded = jwt.verify(token, config.CLE)
    req.user = decoded
  } catch (err) {
    return res.status(401).json({isValid: false})
  }
  return next()
};

module.exports = verifyToken;