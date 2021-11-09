const express = require('express');

const app = express();
const product = require("./routes/productRoute");
const errorMiddleWare = require('./middleware/error');
const user = require('./routes/userRoute');


app.use(express.json());

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use(errorMiddleWare);

module.exports = app;