// const mongoose = require("mongoose");
import mongoose from "mongoose";

mongoose.connect(
  ""
)
.then(() => {
  console.log("CONNECTED");
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});