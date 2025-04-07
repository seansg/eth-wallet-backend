import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import walletRoutes from "./routes/wallet";
// import { listenToTransfers } from "./listeners/transferListener"
// import prisma from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wallets", walletRoutes);

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  // const wallets = await prisma.wallet.findMany()
  // wallets.forEach((w) => listenToTransfers(w.address))

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

bootstrap()

export default app;
