const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../listing.js");
const { application } = require("express");

 
const initDB=async ()=> {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6713c596e251a42cb882aded'}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted");

};
initDB();
