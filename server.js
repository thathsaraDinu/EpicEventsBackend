const express = require("express");
const mongoose = require("mongoose");
const Event = require("./eventModel");
const cors = require("cors");
const multer = require("multer");
const uri =
  "mongodb+srv://thathsaradinuwan:Dinuwan@cluster0.67pv9xt.mongodb.net/?retryWrites=true&w=majority";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Unique filename
  },
});
const port = process.env.PORT || 3001; 
const host = port === 3001 ? "localhost" : "0.0.0.0";
const upload = multer({ storage: storage });

app.use("/images", express.static('uploads'));

app.listen(port, host, () => {
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
    const events = await Event.find();
    return res.json(events);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/eventcreate", upload.single("image"), async (req, res) => {
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

    let eventPhoto;
    if(req.file)
    eventPhoto = `${req.file.filename}`;

    if (
      !eventName ||
      !eventDate ||
      !eventDesc ||
      
      !eventCountry ||
      !eventCity
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Please Fill the required fields" });
    }

    console.log("check1" + req.body.name);
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
      eventPhoto,
    });

    const savedEvent = await newEvent.save();

    res.status(200).json({ status: 200, savedEvent });
  } catch (e) {
    res.status(500).json({ status: 500, e });
  }
});
