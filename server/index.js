const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1331;

app.use("/election", require("./routes/election.routes"));
app.use("/area", require("./routes/area.routes"));
app.use("/party", require("./routes/party.routes"));

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
