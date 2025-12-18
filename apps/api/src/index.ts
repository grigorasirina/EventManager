import "dotenv/config";
import express from "express";
import cors from "cors";
import { eventsRouter } from "./routes/events";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => res.send("API is running ✅"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/events", eventsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
