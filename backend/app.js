const express = require('express');

// importing routes and middleware


const product = require("./routes/productRoute");
const errorMiddleWare = require('./middleware/error');
const user = require('./routes/userRoute');
const cookieParser = require('cookie-parser');



const app = express();


app.use(express.json());
app.use(cookieParser({secret : process.env.COOKIE_SECRET}))

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use(errorMiddleWare);

module.exports = app;