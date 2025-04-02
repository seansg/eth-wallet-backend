import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import walletRoutes from "./routes/wallet";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wallet", walletRoutes);

export default app;
