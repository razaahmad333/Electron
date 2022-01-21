const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/elections",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

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
