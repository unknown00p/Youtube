// const mongoose = require("mongoose");
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://rollrat6:iMpO9FKNMeHtXv49@cluster5.mggxavq.mongodb.net/?appName=Cluster5"
)
.then(() => {
  console.log("CONNECTED");
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});