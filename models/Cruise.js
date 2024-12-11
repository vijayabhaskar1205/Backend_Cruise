import mongoose from 'mongoose'


//type of the room 
const roomTypeSchema= mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    }
});




const crusieSchema= mongoose.Schema({
    noOfDays:{ type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    description:{
       type:String,
       required:true
    },
    departure:{
        type:String,
        required:true
    },
    itineary:{
        type:[String],
        required:true
    },
    basePrice:{
        type:String,
        required:true
    },
    specialAccomodation:{
        type:String,
        required:true
    },
    currentBookings:[]
},{
    timestamps:true
})


const crusieModel=mongoose.model('Cruise',crusieSchema);

export { crusieModel as Cruise };