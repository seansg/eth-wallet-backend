import { Router, RequestHandler } from "express";
import { createWallet, getWallets } from "../controllers/walletController";
import { getBalance } from "../controllers/balanceController";
import { sendETH } from "../controllers/sendETHController";
import { getTransactionHistory } from "../controllers/historyController";

const router = Router();

router.get("/", getWallets as RequestHandler);
router.post("/create", createWallet as RequestHandler);
router.get("/balance/:address", getBalance as RequestHandler);
router.post("/sendETH", sendETH as RequestHandler);
router.get("/history/:address", getTransactionHistory as RequestHandler);

export default router;