const Listing= require("../listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index= async(req,res)=>{
    const alllistings=await Listing.find();
    res.render("./listings/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing= async(req,res)=>{
    const id=req.params.id;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing You're trying to access doesn't exist");
        res.redirect("/Listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
        console.log("Geocoding response:", response.body.features);
     console.log("_______________",req.body.listing.location);
    console.log(response.body.features[0].geometry);
    let url= req.file.path;
    let filename=req.file.filename;
    console.log(url,"....",filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image= {url,filename};
    newListing.geometry=response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log("SavedListing -------------------",savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
 
};

module.exports.renderEditForm= async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing You're trying to access doesn't exist");
        res.redirect("/Listings");
    }
    console.log(listing.image.url);
    let originalImageLink=listing.image.url;
    originalImageLink=originalImageLink.replace("/upload","/upload/h_300/w_250");
    console.log(originalImageLink);
    res.render("listings/edit.ejs",{listing,originalImageLink});
};

module.exports.updateListing= async(req,res)=>{
     
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    if(typeof req.file!== "undefined"){
    let url= req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();}
   
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing= async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};