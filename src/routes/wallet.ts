import { Router, RequestHandler } from "express";
import { createWallet } from "../controllers/walletController";

const router = Router();

router.post("/create", createWallet as RequestHandler);

export default router;