import express from 'express';

const app = express();
app.listen(process.env.port||8080, (result)=>{
    if(result){
        console.log("Failed to connect", result);
        return;
    }
    initRoutes();
    console.log("Listening to port 8080");
});

import productRoutes from './routes/productsRoute.js'
function initRoutes(){
    app.use(express.json());
    app.use(productRoutes);
}
