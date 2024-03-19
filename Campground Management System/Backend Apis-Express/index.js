const express = require("express");
const cors = require('cors');
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const connectDB=require("./DbConnection/dbconnection")
connectDB();
const Campground = require("./CampModel/model");
const app = express();
app.use(express.json());


//https://cloud.mongodb.com/v2/65c28d7fea79b0467f4f779b#/metrics/replicaSet/65f5f255528b1610120739be/explorer/campgrounds/campgrounds/find

//  Local:            http://localhost:3000
//On Your Network:  http://192.168.0.37:3000
/*
npm install cors
*/
//const express = require('express');

app.use(cors()); // Add this line to enable CORS for all routes
const corsOptions = {
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST'], // Allow only these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
  };
  



//In mongodb we always get a promise, and to resolve a promise we will use async 
//when we use async and then for catching error we have to use try-catch block.
//express async handler will be use to hande these {npm i install express-async-handler }
//as we are using async handler we don't need to write explicitly async handler. 
//the asyncHandler will automatically handle that and pass the error to the error handler



// mongoose.connect('mongodb://localhost:27017/Campground', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));
//CONNECTION_STRING=mongodb://localhost:27017; sanketauti 2HDBw7Tu7p50dhh0  2HDBw7Tu7p50dhh0



//create/insert camp info

app.post('/campinfo',asyncHandler (async (req, res) => {
  
        console.log(req.body);
        const{name,reservedDate,location,description,amenities,email,phone,price, rating,reserved,images,reviews,pincode} =req.body;
      
        const contact= await Campground.create({
            name,reservedDate,location,description,amenities,email,phone,price, rating,reserved,images,reviews,pincode
        });
        res.status(201).json(contact);

}));


//get all camps
app.get('/campinfo', async (req, res) => {
    try {
        // const campgrounds = await Campground.find();
        const campgrounds = await Campground.find({}, { _id: 1, name: 1, location: 1, pincode: 1, images: 1 });
        res.json(campgrounds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get camp info by id
app.get('/campinfoid/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
        const campgrounds = await Campground.find({ _id: _id });
        res.json(campgrounds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//reservation price
app.get('/reservationprice/:no_of_people/:_id', async (req, res) => {
    try {
        const people =parseInt(req.params.no_of_people);
        const _id = req.params._id;

        const campgrounds = await Campground.findOne({_id: _id });
        if (!campgrounds) {
            return res.status(404).json({ message: 'Campground not found' });
        }
        var sum=people*campgrounds.price;
        //console.log(campgrounds.price);
        res.json({ message: "Total price for " + people + " people is " + sum });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//book camp
// app.get('/bookcampground/:_id', async (req, res) => {
//     try {
//         const _id = req.params._id;
//         const campgrounds = await Campground.findById(_id);
//         if (!campgrounds) {
//             res.status(404);
//             throw new Error("Campground not found!");
//         }
//         console.log(campgrounds.reserved);
//         if(campgrounds.reserved){
//             res.json({ message: "Sorry, This camp is already booked!!"}); 
//         }else{

//         // Update reserved field to true
//         campgrounds.reserved = true;
//         await campgrounds.save();

//         res.json({ message: "Campground booked successfully on "+ Date() });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

app.get('/bookcampground/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
        const currentDate = new Date(); // Get current date
        const campgrounds = await Campground.findById(_id);

        if (!campgrounds) {
            res.status(404);
            throw new Error("Campground not found!");
        }

        // Check if campground is already booked for the current day
        if (campgrounds.reserved && isSameDate(currentDate, campgrounds.reservedDate)) {
            res.json({ message: "Sorry, This camp is already booked for today!" }); 
        } else {
            // Update reserved field to true and set reservedDate to current date
            campgrounds.reserved = true;
            campgrounds.reservedDate = currentDate;
            await campgrounds.save();
            res.json({ message: "Campground booked successfully on " + currentDate });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Function to check if two dates are on the same day
function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}


//show all available camps
app.get('/getavailablecampgrounds', async (req, res) => {
    try {
        const campgrounds = await Campground.find({ reserved: false }, { _id: 1, name: 1, location: 1, pincode: 1, images: 1 });

        if (campgrounds.length === 0) {
            res.status(404).json({ message: "No available campgrounds found!" });
            return;
        }

        res.json(campgrounds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// app.listen(8800, () => {
//     console.log("Backend server is running!");
// });


const PORT = process.env.PORT ||8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







