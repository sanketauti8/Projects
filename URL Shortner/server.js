require("dotenv").config();
const express=require('express');
const path=require("path");
const cookieParser=require("cookie-parser");
const mongoose = require("mongoose");
const URL=require("./models/url") 
const staticRoute=require("./routes/staticRouter");
const urlRoute=require("./routes/url");
const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth")
const userRoute=require("./routes/user");
//const {connectToMongoDB}=require("./connect");
const app=express();
const PORT = process.env.PORT || 8000;
//connection
// connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>{
//     console.log("MongoDB Connected")
// });

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));


app.set("view engine","ejs"); //here we are setting up the ejs- for server side rendering
app.set("views",path.resolve("./views")); //path for that

app.use(express.json()); //this middleware use for parsing the json request
app.use(express.urlencoded({extended:false})); //this middleware use to parse form data
app.use(cookieParser());
//registering the routes
app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/",checkAuth,staticRoute); 
app.use("/user",userRoute);


app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            },
        });

        if (!entry) {
            console.error("No entry found for shortId:", shortId);
            return res.status(404).send("URL not found");
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT,()=>{
    console.log(`Server Started on PORT: ${PORT}`);
})