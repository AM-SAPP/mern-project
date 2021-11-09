// Config

require("dotenv").config({path: "backend/config/config.env"});


const app = require('./app');
const connectdb = require('./config/database');

// Handling Uncaught Rejection

process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting Down the server due to uncaught errors`);
    process.exit(1);
})



// Connecting to db
connectdb();
const server = app.listen(process.env.PORT,()=>{
    console.log(`listening to http://localhost:${process.env.PORT}`);
});


// Unhandled Promise Rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    })
})