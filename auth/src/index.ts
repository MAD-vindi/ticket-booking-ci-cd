import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("starting up...1..2..3");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (err) {
    console.error(err);
  }
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}!!!!`);
  });
};

start();
