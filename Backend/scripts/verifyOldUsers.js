import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await User.updateMany(
    { isVerified: { $exists: false } },
    { $set: { isVerified: true } }
  );

  console.log(`Updated ${result.modifiedCount} old users to verified.`);

  await mongoose.disconnect();
};

run();