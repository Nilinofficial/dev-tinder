const authUser = (req,res,next) => {
     const token = "xydz";
     if(token === "xyz") {
        next();
     }else {
        res.status(401).send("invalid token");
     }
}

module.exports = {
    authUser
}