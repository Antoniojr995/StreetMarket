const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors =  require("cors");


const app = express();

const isProdution = process.env.NODE_ENV === "production";
const PORT= process.env.PORT || 3000;

app.use("/public",express.static(__dirname + "/plublic"));
app.use("/public/images",express.static(__dirname + "/plublic/images"));


const dbs = require("./config/database");
const dbURI = isProdution ? dbs.dbProduction : dbs.dbTest;
mongoose.Connection(dbURI,{useNewUrlParser: true});


app.set("view engine", "ejs");
if(!isProdution) app.use(morgan("dev"));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());

app.use(bodyParser.urlencoded({extended:false,limit:1.5*1024*1024}));
app.use(bodyParser.json({limit:1.5*1024*1024}))


require("./models");


app.use("/",require("./routes"));


app.use((res,res, next)=> {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    if(err.status !== 404)console.warn("Error:",err.message, new Date());
    res.json({errors:{message:err.message, status:err.status}});
});

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`Rodando na //localhost:${PORT}`);
});
