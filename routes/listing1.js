const express= require("express");
const app=express();
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../utils/schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing=require("../listing.js");
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
const {isLoggedIn,isOwner,validateListing,validateReview} = require("../middleware.js");
const multer  = require('multer');
const {storage}= require("../cloudconfig.js");
const upload = multer({ storage });

app.set("listings",path.join("__dirname","listings"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const review = require("../review.js");

const listingController= require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post( isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
     

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm );

//show route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

 
module.exports = router;
