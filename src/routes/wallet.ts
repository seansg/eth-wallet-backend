import { Router, RequestHandler } from "express";
import { createWallet, getWallets } from "../controllers/walletController";
import { getBalance } from "../controllers/balanceController";
import { transfer } from "../controllers/transferController";
import { getTransactionHistory } from "../controllers/historyController";

const router = Router();

router.get("/", getWallets as RequestHandler);
router.post("/create", createWallet as RequestHandler);
router.get("/balance/:address", getBalance as RequestHandler);
router.post("/transfer", transfer as RequestHandler);
router.get("/history/:address", getTransactionHistory as RequestHandler);

export default router;