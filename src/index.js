import dotenv from "dotenv";
import connectDB from "./db/connect_db.js";

dotenv.config({
    path: "../.env"
});

connectDB();

