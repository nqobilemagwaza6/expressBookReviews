const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const accessToken = req.headers['authorization']; // get token from header
if (!accessToken) {
    return res.status(401).json({ message: "Access token missing" });
}

const sessionUser = req.session.authorization && req.session.authorization[accessToken];
if (!sessionUser) {
    return res.status(403).json({ message: "User not authenticated" });
}

// user is authenticated
next();
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.get("/", (req, res) => res.send("Book Review API is running!"));


app.listen(PORT,()=>console.log("Server is running"));
