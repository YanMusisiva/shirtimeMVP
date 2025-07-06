import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return;
  }
  await mongoose.connect(uri, clientOptions);
  if (mongoose.connection.db) {
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } else {
    throw new Error("Database connection is undefined.");
  }
}

export default dbConnect;
