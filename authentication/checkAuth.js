const checkAuth = (req,res,next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({userAuthenticated:false});
        return;
    }
    next();
}

export default checkAuth;
