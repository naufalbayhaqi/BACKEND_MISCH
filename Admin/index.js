import express from "express";
import cors from "cors";
import { db } from "./config/Database.js";
import Router from "./routes/index.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Init express
const app = express();
// use express json
app.use(express.json());
// use cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
// Testing database connection
try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// use router
app.use(Router);

// listen on port
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
