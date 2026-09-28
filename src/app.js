import express from "express";
import cors from "cors";
import pilotRoutes from "./routes/pilotRoutes.js";
import { config } from "./config.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: config.bodyLimit }));

app.use("/api", pilotRoutes);

app.get("/", (req, res) => {
  res.redirect(301, "https://gitpilotcli.vercel.app");
});

app.use(notFound);
app.use(errorHandler);

export default app;
