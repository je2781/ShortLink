import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UrlMapSchema = new Schema({
  short: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
});

const mapModel = mongoose.model("urlmaps", UrlMapSchema);

export default mapModel;
