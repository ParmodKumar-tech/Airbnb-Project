const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("./user.js");


const listingSchema=new mongoose.Schema({
    title:
    {
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },
    
    image:{
           url: String,
           filename:String,
            
    },

    price:{
        type:Number,
        required:true
    },

    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        require:true    
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],

    owner: // owner of the listing/posts
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        },

    category:{
        type:String,
        
        // enum:["mountains","artics","farms","deserts"]
    }
})


// delete middleware--
listingSchema.post("findOneAndDelete" , async(lists)=>{
    if(lists){
        await Review.deleteMany({_id: {$in: lists.reviews}});
    }
});


const listingCollection=mongoose.model("Listing",listingSchema);

module.exports=listingCollection;

