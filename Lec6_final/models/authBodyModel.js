import Joi from 'joi';
import fs from 'fs/promises';
import crypto from 'crypto-js';

const usersFileDir = './data/users.json';
export const newUserBodySchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().required()
});

export const loginBodySchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().min(8).required()
});

export async function saveUser(user, options = {hashPassword:true}){
    let{hashPassword} = options;
   try{
    let users = await readFromFile(usersFileDir);
    let userClone = {...user};
    if(hashPassword)
        userClone.password = crypto.PBKDF2(user.password, process.env.SIGN).toString();
    users[user.userName] = userClone;
    writeInFile(users, usersFileDir);
   }catch(err){
    return err;
   }
}

export async function checkCredentials(body){
    let users = await readFromFile(usersFileDir);
    let userInfo = users[body.userName];
    if(!userInfo) return{result:false, message:"Not registerd"}
    let password = crypto.PBKDF2(body.password, process.env.SIGN).toString();
    if(password != userInfo.password){
        return {result: false, message: "Wrong Password"}
    }
    return {result: true, user: userInfo};
}

export async function checkUserName(userName){
    let users = await readFromFile(usersFileDir);
    return users[userName];
}

async function readFromFile(dir){
    let data = await fs.readFile(dir, 'utf8').catch(async(err)=>{
        if(err.code === 'ENOENT') {
            await writeInFile({}, usersFileDir);
        }
        else throw(err);
    });
    data??={};
    return JSON.parse(data);
}
async function writeInFile(data, dir){
    await fs.writeFile(dir, JSON.stringify(data)).catch((err)=>{
        console.log("write file ",err);
    });
}