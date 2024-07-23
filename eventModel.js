const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchemaModel = new Schema({
    eventId:{type: String, unique: true},
    eventName: {type: String, required: true},
    eventDate: {type: String, required: true},
    eventTime: {type: String},
    eventDesc: {type: String, required: true},
    eventCountry: {type: String, required: true},
    eventCity: {type: String, required: true},
    eventAddress: {type: String},
    eventPhoto: { type: String },
    isFeatured: Boolean
});

const Event = mongoose.model("Event", eventSchemaModel);
module.exports = Event;