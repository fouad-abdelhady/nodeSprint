import {manageProducts} from './modules/products.js'
import http from 'http'

http.createServer(function(req,res){
    handelReq({req, res});
    req.me
}).listen(8080);

function handelReq({req, res}){
   // const reqUrl = new URL(req.url);
   let [_, ...pathes] = req.url.split('/');
    if(pathes.at(0).search(/^(products)/g) == 0){
        manageProducts({req, res, pathes});
    }
    else{
        res.write("unknowen Path");
        res.end();
    }
} 