import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import walletRoutes from "./routes/wallet";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
