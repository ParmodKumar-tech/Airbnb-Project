
const Listing=require("../Models/listing");


module.exports.showLists=async (req,res)=>{   
    let allData= await Listing.find();
    res.render("show_data.ejs",{allData});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("show_form.ejs");
}

module.exports.showListDetails=async (req,res)=>{
    let {id}=req.params;
    // let targetData= await Listing.findById(id).populate("owner").populate("reviews");
    
   
    let targetData= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(targetData)

  
    if(!targetData){

        req.flash("error","Listing does not exist !");
        res.redirect("/lists");
        
    }else{

        res.render("item_details.ejs",{targetData});

    }
}


module.exports.showMountainsPlace=async(req,res)=>{
    // here show only place which in "mountains" category

    let allData= await Listing.find({category:"mountains"});
    
    res.render("show_data.ejs",{allData});
}


module.exports.createList = async (req, res, next) => {


        let url=req.file.path;// Cloudinary URL
        let filename=req.file.filename // Cloudinary filename
    
        const newListing=new Listing({...req.body,owner:req.user._id});

    

        // Save the new listing to the database
        newListing.image={url,filename};
        await newListing.save();

        // Flash a success message and redirect
        req.flash("success", "New Listing has been created!");
        res.redirect("/lists");
   
    }


module.exports.renderUpdateForm=async(req,res)=>{
    
    let {id}=req.params;
    let currentUserData= await Listing.findById(id);
    if(!currentUserData){
        req.flash("error","Listing does not exist !");
        res.redirect("/lists");
    }

    let originalImageUrl=currentUserData.image.url;
 
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250")
   
    res.render("update_form.ejs",{currentUserData,originalImageUrl});
}

module.exports.updateList=async(req,res)=>{
   
    let {id}=req.params;
    let updateListing=await Listing.findByIdAndUpdate(id,{...req.body});
    
    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updateListing.image={url,filename};
        await updateListing.save();
    }
   

    req.flash("success","Updation is successfull !");
    res.redirect(`/lists/${id}`);
}

module.exports.deleteList=async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted !");
    res.redirect("/lists");
}
    
