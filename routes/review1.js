const express= require("express");
const router = express.Router({mergeParams:true});
const app=express();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../utils/schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing=require("../listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const {validateReview,isLoggedIn} = require("../middleware.js");

app.set("listings",path.join("__dirname","listings"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const review = require("../review.js");
const reviewController=require("../controllers/reviews.js");



router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview));

module.exports = router;