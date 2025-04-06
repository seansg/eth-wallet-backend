import { Router, RequestHandler } from "express";
import { createWallet, getWallets } from "../controllers/walletController";
import { getBalance } from "../controllers/balanceController";

const router = Router();

router.get("/", getWallets as RequestHandler);
router.post("/create", createWallet as RequestHandler);
router.get("/balance/:address", getBalance as RequestHandler);

export default router;