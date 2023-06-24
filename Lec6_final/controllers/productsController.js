import service from "../utils/services.js";

export async function getProducts(req, res){
    let productId = req.params.id;
    let result  = await service.getRequest(`https://api.escuelajs.co/api/v1/products/${productId??''}`);
    if(result.message){
        res.status(404).send({message: "There is no product with this Id"});
        return;
    }
    res.send(result);

}

export async function createProduct(req, res){
    let body = req.body;
    const url = 'https://api.escuelajs.co/api/v1/products/';
    let response = await service.postRequest(url, body);
    response = response.message? {message: response.message}: response;
    res.status(response.statusCode??200).send(response);
}

export async function updateProduct(req, res){
    let url = `https://api.escuelajs.co/api/v1/products/${req.params.id}`;
    let response  = await service.putRequest(url, req.body);
    res.send(response);
}

export async function deleteProduct(req, res){
    let url = `https://api.escuelajs.co/api/v1/products/${req.params.id}`;
    let response  = await service.deleteRequest(url);
    if(response.message){
        res.status(404).send({message: "There is no product with this Id"});
        return;
    }
    res.send(response);
}