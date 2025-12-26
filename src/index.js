import dotenv from "dotenv";
import connectDB from "./db/connect_db.js";
import app from "./app.js";

dotenv.config({
    path: "../.env"
});

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server running on port ", process.env.PORT || 8000);
    })
}).catch((error) => {
    console.log("Mongoose connection error", error);
    process.exit(1);
})

