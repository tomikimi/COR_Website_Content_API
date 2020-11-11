const config = require("config");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const facility = require("./routes/facility");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR:jwt private key not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/CORWebContent", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection to Database Successfull."))
  .catch((err) => console.error("connection to Database failed"));

app.use(cors());
app.use(express.json());
app.use("/api/facility", facility);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
