import fetch from 'node-fetch';
class Services {

    constructor(){
      
    }

    async postRequest(url, body){
        let requestBody = body??{};
        const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    const data = await response.json()
    return data;
    }

    async putRequest(url, body){
        let requestBody = body??{};
        const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    const data = await response.json()
    return data;
    }

    async deleteRequest(url){
        const response = await fetch(url,
            {
                method: 'DELETE',
                headers:{
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
        const data = await response.json();
        return data;
    }

    async getRequest(url, params){
        if(params != null){
            url = `${url}?${new URLSearchParams(params)}`;
        }
        const response = await fetch(url,
            {
                method: 'GET',
                headers:{
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
        const data = await response.json();
        return data;
    }
}
let service = new Services();
export default service;
