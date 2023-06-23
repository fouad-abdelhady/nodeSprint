import * as authBodySchema from '../models/authBodyModel.js';
import Jwt from "jsonwebtoken";

export const users = {
    admin:["all"],
    customer:[
        "getProduct",
        "getProducts"
    ]
}

export async function createAccount(req, res){
    let user = req.body;
    if(!users[user.role]){
        res.status(400).send({message:"Only the roles of 'admin' or 'customer' are allowed in the request body for the 'role' property."});
        return;
    }
    if(await authBodySchema.checkUserName(user.userName)){
        res.status(400).send({message:"User name is already registered"});
        return;
    }
    let userForToken = {userName: user.userName, role: user.role};
    user.refreshToken = createRefreshToken(userForToken);
    res.send({token:createAccessToken(userForToken), refreshToken: user.refreshToken});
    await authBodySchema.saveUser(user);
}

export async function loginUser(req, res){
    let result = await authBodySchema.checkCredentials(req.body);
    if(!result.result){
        res.status(401).send(result);
        return;
    }
    let userForToken = {userName: result.user.userName, role: result.user.role};
    result.user.refreshToken = createRefreshToken(userForToken);
    res.send({
        userName: result.user.userName,
        token:createAccessToken(userForToken), 
        refreshToken: result.user.refreshToken});
    authBodySchema.saveUser(result.user, {hashPassword : false});
}

export function validateNewUser(req, res, next){
    authBodySchema.newUserBodySchema.validate(req.body)
}

export const  verifyUser = (action)=>(req, res, next)=>{
    if(!verifyToken(req, res)) return;
    if(!isUserAuthorized(action, req.user.role)){
        res.sendStatus(401);
        res.send({message:"You are not authorized to perform that action."});
        return;
    }
    next();
}

export async function getNewToken(req, res){
    if(!verifyToken(req, res,{isAccessToken:false}))return;
    let userData = await authBodySchema.checkUserName(req.user.userName);
    if(!userData){
        res.status(500).send({message:"Your account maybe deleted please create another account"});
        return;
    }
    if(userData.refreshToken != req.token){
        res.status(401).send({message:"The token you sent is old"});
        return;
    }
    res.send({token: createAccessToken(req.user), refreshToken: userData.refreshToken});
}

export async function signUserOut(req, res){
    if(!verifyToken(req,res))return;
    let userData = await authBodySchema.checkUserName(req.user.userName);
    if(!userData){
        res.status(500).send({message:"Your account maybe deleted please create another account"});
        return;
    }
    userData.refreshToken = null;
    await authBodySchema.saveUser(userData,{hashPassword: false});
    res.send({message:"Success"});
}

function createAccessToken(userInfo){
    const now = Math.floor(Date.now() / 1000); // get current time in seconds
    const expiresIn = 20; 
    const exp = now + expiresIn; 
    return Jwt.sign({ ...userInfo, exp }, process.env.ACCESS_TOKEN);
}

function createRefreshToken(userInfo){
    return Jwt.sign(userInfo, process.env.REFRESH_TOKEN);
}

function verifyToken(req, res, options={isAccessToken : true}){
    const token  = req.headers.authorization.split(' ')[1];
    let {isAccessToken} = options;
    if(!token){
        res.status(401).res.send({message:"Use POST http://localhost:8080/createAccount or POST http://localhost:8080/login for new token"});
        return false;
    }
    let result = false;
    let key =  isAccessToken ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN;
    Jwt.verify(
        token, 
        key, 
        (err, userInfo)=>{
        if(err){
            res.status(401).send({message:isAccessToken?"Use GET http://localhost:8080/freshToken with the refresh token for new token" :"Invalid token"});
            return false;
        }
        req.user = userInfo;
        req.token = token;
        result = true;
    });
    return result;
}

function isUserAuthorized( action, role){
    if(role === 'admin' || users[role].includes(action)) return true;
    return false;
}