import {CurrencyApi, Configuration} from '@devmehq/sdk-js';
import fetch from 'node-fetch';
import fs from 'fs/promises'
const apiKey = '6489b7cac5779da4900b9f2e-90c2cad3e836';
const config = new Configuration({apiKey: apiKey});
const converter = new CurrencyApi(config);

async function begin(){
    const url = "https://api.escuelajs.co/api/v1/products";
    let response  = await fetch(url);
    let products = await response.json();
    separteBasedOnCategory(products).then(saveOutput);
}

async function separteBasedOnCategory(products){
    const categories = new Map();
    let exchangeRate = await getExchangeRate();
    for(let product of products){
       product.price *=exchangeRate;
       if(categories.has(product.category.id)){
        categories.get(product.category.id).push(product);
        continue;
       }
       categories.set(product.category.id, [product]);
    }
    return categories;
}

async function getExchangeRate(){
    let body = {amount: 1 ?? 0, from: 'USD', to:'EGP'};
    let {data} = await converter.v1ConvertCurrency(body);
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
begin();