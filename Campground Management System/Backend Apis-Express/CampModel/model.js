const mongoose=require("mongoose");


const campgroundSchema = mongoose.Schema({
   name:{
    type:String,
   // required:[true,"please add the contact name"],
},
isAvailable: {
    type: Date,
    default: function() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to the current date
        return tomorrow;
     }
 },
 reservedDate:{
    type:Date,
    //required:[true,"please add the contact email address"],
},
location:{
    type:String,
    //required:[true,"please add the contact email address"],
},
description:{
    type:String,
   // required:[true,"please add the contact phone number"],
},
amenities:{
  type:String,
 // required:[true,"please add the contact name"],
},
email:{
  type:String,
  //required:[true,"please add the contact email address"],
},
phone:{
  type:String,
 // required:[true,"please add the contact phone number"],
},
price:{
  type:Number,
 // required:[true,"please add the contact name"],
},
rating:{
  type:String,
  //required:[true,"please add the contact email address"],
},
images:{
  type:String,
  //required:[true,"please add the contact phone number"],
},
reviews:{
type:String,
//required:[true,"please add the contact name"],
},
reserved:{
    type:Boolean,
    default: false, // Set default value to false
    //required:[true,"please add the contact email address"],
    },
pincode:{
type:Number,
//required:[true,"please add the contact email address"],
}
},
{
    timestamps:true,
});

module.exports=mongoose.model("Campground",campgroundSchema);