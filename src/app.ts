import express from "express";
import cors from "cors";
import * as dotenv from "dotenv"; // 修正 dotenv 的導入方式
import walletRoutes from "./routes/wallet";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});