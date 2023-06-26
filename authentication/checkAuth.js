const checkAuth = (req,res,next) => {
    if (!req.isAuthenticated() || !req.session || !req.session.passport || !req.session.passport.user) {
        res.status(401).json({status: "fail", data: { isAuthenticated: false, user: null}});
        return;
    }
    next();
}

export default checkAuth;
