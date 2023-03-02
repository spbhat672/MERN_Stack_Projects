const items = require('../utils/data');
const capacity = 1000;

//get items
const getItemController=async(req,res)=>{
    try{
        const data = {items,capacity};
        res.status(200).send(data);
    }catch(err){
        console.log(err);
    }
};

module.exports = {getItemController}