import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UrlMapSchema = new Schema({
    map: {
        short: {
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('urlmaps', UrlMapSchema);