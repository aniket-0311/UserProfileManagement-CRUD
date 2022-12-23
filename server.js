require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Mongoose Connection
const dbURL = process.env.DB_CONNECT;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, });

const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => {
    console.log("Database Connected");
});

// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Import routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute")
// Middleware for routes
app.use("/api", userRoute);
app.use("/api", adminRoute);

// App Serving on port
app.listen(7000, ()=>{
    console.log("Serving on port 7000");
});