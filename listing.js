const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review.js")

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    // image:{
    //     filename:{type:String},
    //     type:String,
    //     default:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    //     set:(v)=>
    //         v===""
    //          ? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    //          : v,
    // },

    image: {
        url:String,
        filename:String
        // filename: { type: String },
        // url: { type: String }
      },
    price:{
        type:Number
    },
    country:
    {
        type:String
    },
    location:{
        type:String
    },
    reviews:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
       } 
    
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }  
        }
    

});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;