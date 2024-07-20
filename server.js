const express = require("express");
const mongoose = require("mongoose");
const Event = require("./eventModel");
const cors = require("cors");
const uri =
  "mongodb+srv://thathsaradinuwan:Dinuwan@cluster0.67pv9xt.mongodb.net/?retryWrites=true&w=majority";
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3001, "localhost", () => {
  console.log("Server started on 3001");
});

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("MongoDB error", error);
  }
};

connect();



app.get("/events", async (req, res) => {
  try {
    const events = await Event.find()
    return res.json(events);
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post("/eventcreate", async (req, res) => {
  try {
    console.log(req.body.name);
    const {
      name: eventName,
      date: eventDate,
      time: eventTime,
      desc: eventDesc,
      country: eventCountry,
      city: eventCity,
      address: eventAddress,
    } = req.body;

    console.log(eventName, eventDate);
    if (!eventName || !eventDate || !eventTime || !eventDesc || !eventAddress || !eventCountry || !eventCity) {
      return res
        .status(400)
        .json({ status: 400, message: "All fields are required." });
    }

    const prEventID = await Event.findOne().sort({ _id: -1 });
    let eventId;
    if (prEventID) eventId = prEventID.eventId + 1;
    else eventId = 10010;

    const newEvent = new Event({
      eventId,
      eventName,
      eventDate,
      eventTime,
      eventDesc,
      eventCountry,
      eventCity,
      eventAddress,
    });

    const savedEvent = await newEvent.save();

    res.status(200).json({ status: 200, savedEvent });
  } catch (e) {
    res.status(500).json({ status: 500, e });
  }
});
