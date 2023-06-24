import service from "../utils/services.js";

export async function getCategory(req, res){
    let categoryId = req.params.id;
    let result  = await service.getRequest(`https://api.escuelajs.co/api/v1/categories/${categoryId??''}`);
    if(result.message){
        res.status(404).send({message: "There is no Category with this Id"});
        return;
    }
    res.send(result);
}

export async function createCategory(req, res){
    let body = req.body;
    const url = 'https://api.escuelajs.co/api/v1/categories/';
    let response = await service.postRequest(url, body);
    response = response.message? {message: response.message}: response;
    res.status(response.statusCode??200).send(response);
}

export async function updateCategory(req, res){
    let url = `https://api.escuelajs.co/api/v1/categories/${req.params.id}`;
    let response  = await service.putRequest(url, req.body);
    res.send(response);
}

export async function deleteCategory(req, res){
    let url = `https://api.escuelajs.co/api/v1/categories/${req.params.id}`;
    let response  = await service.deleteRequest(url);
    if(response.message){
        res.status(404).send({message: "There is no category with this Id"});
        return;
    }
    res.send(response);
}