require("dotenv").config({path: "backend/config/config.env"});
const app = require('./app');
const connectdb = require('./config/database');


connectdb();
app.listen(process.env.PORT,()=>{
    console.log(`listening to http://localhost:${process.env.PORT}`);
})