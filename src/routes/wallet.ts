import { Router } from "express";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/create", async (_, res) => {
  const wallet = ethers.Wallet.createRandom();
  await prisma.wallet.create({
    data: { address: wallet.address },
  });
  res.json({ address: wallet.address, privateKey: wallet.privateKey });
});

export default router;
