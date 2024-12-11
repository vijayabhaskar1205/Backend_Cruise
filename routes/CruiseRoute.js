import express from 'express'
import {Cruise} from '../models/Cruise.js';
const router = express.Router();
router.get("/getallcruises",async(req,res)=>{

    try{
        const cruise=await Cruise.find({})
        console.log(cruise);
        return res.json({cruise});
    }catch(error){
        console.log(error);
          return res.status(400).json({messege:error});
    }
   
});


export { router as RoomsRouter };