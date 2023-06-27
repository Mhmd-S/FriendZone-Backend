const checkAuth = (req,res,next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({status: "fail", data: { isAuthenticated: false, user: null}});
        return;
    }
    next();
}

export default checkAuth;
