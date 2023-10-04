import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UrlMapSchema = new Schema({
  shortId: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
}, {timestamps: true});

const mapModel = mongoose.model("urlmaps", UrlMapSchema);

export default mapModel;
