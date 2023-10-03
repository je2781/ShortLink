import bodyParser from 'body-parser';
import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
require("dotenv").config();

const shortRoutes = require('../routes/shortest');

const app = express();

//parsing body of client request - for json data
app.use(bodyParser.json());
//parsing body of client request - only for text requests
app.use(bodyParser.urlencoded({ extended: false }));

//express app config settings
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(shortRoutes);


app.use((error, req, res, next) => {
  res.status(500).render('500', 
  {
      docTitle: 'Server Error', 
      path: '/500',
      msg: error.message
  });
});

mongoose.connect(process.env.MONGODB_URI!).then((_) => console.log('connected to database'));

module.exports.handler = serverless(app);
