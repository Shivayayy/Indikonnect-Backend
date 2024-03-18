const express = require('express');
require('dotenv').config();
require('./Models/db');
const userRouter = require('./Routes/user');
const shopRouter =require('./Routes/shop');
const shopkeeperRouter =require('./Routes/shopkeeper');
const app = express();


app.use(express.json());
app.use(userRouter);
app.use(shopRouter);


app.listen(8000, () => {
  console.log('Port is listening');
});
