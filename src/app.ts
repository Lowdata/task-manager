"use strict";

import express from "express";
import userRoutes from "./routes/userRouter";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager!");
});

app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Invalid endpoint" });
});


export default app;
