 const validateBody = (bodySchema) => (req, res, next)=>{
    let body = req.body;
    let error = bodySchema.validate(body).error;
    
    if(error){
        res.status(500).send({message: error});
        return;
    }
    next();
}
export default validateBody;