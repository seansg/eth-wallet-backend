import { Router, RequestHandler } from "express";
import { createWallet, getWallets } from "../controllers/walletController";
import { getAssets } from "../controllers/assetsController";
import { sendETH } from "../controllers/sendETHController";
import { getTransactionHistory } from "../controllers/historyController";
import { estimateGasCost } from "../controllers/estimateGasController";

const router = Router();

router.get("/", getWallets as RequestHandler);
router.post("/create", createWallet as RequestHandler);
router.get("/assets/:address", getAssets as RequestHandler);
router.post("/sendETH", sendETH as RequestHandler);
router.get("/history/:address", getTransactionHistory as RequestHandler);
router.post("/estimateGas", estimateGasCost as RequestHandler);

export default router;