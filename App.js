if(process.env.NODE_ENV != "production"){
    require('dotenv').config();}


const express= require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./utils/schema.js");
const session = require("express-session");
const  flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./user.js");
const MongoStore=require("connect-mongo");
app.use(express.static('listings'));


const listingRouter= require("./routes/listing1.js");
const reviewsRouter = require("./routes/review1.js");
const userRouter = require("./routes/user.js");
// const ejsLint = require('ejs-lint');

app.set("listings",path.join("__dirname","listings"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongoose=require("mongoose");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dburl=process.env.ATLASDB_URL;

const Listing=require("./listing.js");
const review = require("./review.js");

const listingController= require("./controllers/listing.js");

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});
async function main(){
   await mongoose.connect(dburl);
}
 
// app.get("/stesting",async(req,res)=>{
//     let sample= new Listing({
//         title:"Villa",
//         description:"Beautiful villa with a pool",
//         price:1000,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sample.save();
//     console.log("Sample was saved");
//     res.send("sample saved succesfully");

// });

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600
});

store.on("error",()=>{
    console.log("Error in session store",err);
});

const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta_student"
//     });
//     let registeredUser= await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

const validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
        console.log(error);
        if(error){
            let errMsg =error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        } 
};

const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
        console.log(error);
        if(error){
            let errMsg =error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        } 
};



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

//index route
app.get("/Listings",wrapAsync(listingController.index));

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong!"} =err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
app.use((req, res, next) => {
    res.locals.page = null; // Default value
    next();
});

app.get('/popular', (req, res) => {
    res.locals.page = 'popular';
    res.render('layouts/boilerplate');
});

  app.get('/arts', (req, res) => {
    res.render('./partials/arts'); // Render the Arts & Culture content
  });
  
  app.get('/outdoors', (req, res) => {
    res.render('./partials/outdoors'); // Render the Outdoors content
  });
  app.listen(8080,(req,res)=>{
    console.log("server is running on port 8080");
});