const express = require('express');
var cors =require('cors')
require('dotenv').config();
require('./Models/db');
const userRouter = require('./Routes/user');
const shopRouter =require('./Routes/shop');
const shopkeeperRouter =require('./Routes/shopkeeper');
const app = express();

app.use(cors())
app.use(express.json());
app.use(userRouter);
app.use(shopRouter);
app.use(shopkeeperRouter);


app.listen(8000, () => {
  console.log('Port is listening');
});
