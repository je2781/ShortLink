import mongoose from "mongoose";
import serverless from "serverless-http";
import app from './api';

mongoose.connect(process.env.MONGODB_URI!).then((_) => {
    console.log("connected to database");
    app.listen(8000);
  });
