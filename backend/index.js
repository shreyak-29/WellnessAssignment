import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});
const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
      app.listen(PORT, () => {
    console.log(`⚙️ Server is running on port ${PORT}`);
});
    })
    .catch((error) => {
        console.error(` ❌ fail to connect: ${error.message}`);
        process.exit(1);
    });