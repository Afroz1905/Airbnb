const Listing=require("../listing.js");
const review = require("../review.js");

module.exports.createReview= async(req,res)=>{
    let idd = req.params.id;
    let listing =await Listing.findById(idd);
    let newReview  = new review(req.body.review);
     newReview.author= req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}= req.params;
    await review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};