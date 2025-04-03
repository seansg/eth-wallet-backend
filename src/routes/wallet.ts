import { Router, RequestHandler } from "express";
import { createWallet, getWallets } from "../controllers/walletController";

const router = Router();

router.get("/", getWallets as RequestHandler);
router.post("/create", createWallet as RequestHandler);

export default router;