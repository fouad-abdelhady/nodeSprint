import {CurrencyApi, Configuration} from '@devmehq/sdk-js';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import Joi from 'joi'
import {parse} from 'querystring'
import { resourceUsage } from 'process';

const apiKey = '6489b7cac5779da4900b9f2e-90c2cad3e836';
const config = new Configuration({apiKey: apiKey});
const converter = new CurrencyApi(config);
const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().integer().min(1).required(),
    description: Joi.string().required(),
    categoryId: Joi.number().integer().min(1).max(24).required(),
    images: Joi.array().items(Joi.string()).required()
});

/*********************************GET PRODUCTS Grouped by category******************************** */
async function getProducts({currency}){
    currency = currency??'USD';
    const url = "https://api.escuelajs.co/api/v1/products";
    let response  = await fetch(url);
    let products = await response.json();
    return await separteBasedOnCategory(products, currency);
}

async function separteBasedOnCategory(products, currency){
    const categories = {};
    let exchangeRate = await getExchangeRate(currency);
    for(let product of products){
       product.price *=exchangeRate;
       if(product.category.id in categories){
        categories[product.category.id].push(product);
        continue;
       }
       categories[product.category.id] = [product];
    }
    return categories;
}

async function getExchangeRate(currency){
    let body = {amount: 1 ?? 0, from: 'USD', to: currency};
    
    let {data} = await converter.v1ConvertCurrency(body);
    if(!data.convertedAmount) throw("Unrecognized Currency");
    return data.exchangeRate;
}

async function saveOutput(categories){
    let output = [];
    let category = {};
    for(const [key, value] of categories){
        category.name = `category${key}`;
        category.id = key;
        output.push({
            category: category,
            products: value
        });
        category = {};
    }
    await fs.writeFile(`./Lec2_problem/output/products.json`, JSON.stringify(output));
}
/*********************************ADD PRODUCT***********************************/

async function addProduct(body){
    if(!validateBody(body).status)return {statusCode:400, response: validateBody(body).error};
    const response = await fetch("https://api.escuelajs.co/api/v1/products/", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    })
    const data = await response.json()
    console.log(data);
    return {statusCode:data.statusCode??200, response: data.message??data};
}

function validateBody(body){
   let error = schema.validate(body).error;
   if(!error) return{status: true};
   return {status: false, error:error};
}

/*********************************Products routes management******************************** */
const apisResponse = {
    "message":"Our APIs", 
    "AddProductAPI": "POST http://localhost:8080/products/addProduct",
    "getCategorizedProducts": "GET http://localhost:8080/products",
    "getCategorizedProductsWithConvertedCurrency": "GET http://localhost:8080/products?CUR=<The currency apprivation Ex: EGP or SAR>"
}
export function manageProducts({req, res, pathes}){
    if(req.method === "GET"){
       getRequestAction(req, res, pathes);
    }else if(req.method === "POST"){
       postRequestAction(req, res, pathes)
    }
    else{
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(404);
        res.write(JSON.stringify(apisResponse));
        res.end();
    }
}

async function getRequestAction(req, res, pathes){
    res.setHeader('Content-Type', 'application/json');
    if(pathes.at(0).match(/^(products)\?(CUR=)[A-Z]{3}$/m)){
        try{
            let result = await getProducts({currency:pathes.at(0).replace(/(products)\?(CUR=)/, "")});
            res.writeHead(200);
            res.write(JSON.stringify(result));
            
        }catch(err){
            res.writeHead(400);
            res.write(JSON.stringify({error: err}));
        }finally{
            res.end();
        }
    }else{
        res.writeHead(400);
        res.write(JSON.stringify(apisResponse));
        res.end();
    }
}

function postRequestAction(req, res, pathes){
    res.setHeader('Content-Type', 'application/json');
    if(pathes.join("/").match(/^(products)\/(addProduct)$/m)){
        let data = [];
        let body;
        req.on('data', chunk =>{
            data.push(chunk);
        });
        req.on('end', async()=>{
            body = JSON.parse(data.join(""));
            let result = await addProduct(body);
            res.writeHead(result.statusCode);
            res.write(JSON.stringify(result.response));
            res.end();
        });
    }else{
        res.writeHead(404);
        res.write(JSON.stringify(apisResponse));
        res.end();
    }
}

function extractRequestBody(req){
    
    
}