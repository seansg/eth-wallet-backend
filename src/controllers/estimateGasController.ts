import { Request, Response } from "express";
import { ethers } from 'ethers';
import provider from "../config/provider";

export const estimateGasCost = async (req: Request, res: Response) => {
  const { fromAddress, toAddress, amount } = req.body;

  if (!fromAddress || !toAddress || !amount) {
    return res.status(400).json({ error: "請提供 fromAddress, toAddress, value" });
  }

  const estimatedGas = await provider.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: ethers.parseEther(amount),
  });

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    throw new Error('Network does not support');
  }
  const gasCost = estimatedGas * feeData.maxFeePerGas;

  res.json({
    estimatedGas: estimatedGas.toString(),
    maxFeePerGas: feeData.maxFeePerGas.toString(),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toString(),
    gasCost: ethers.formatEther(gasCost),
  });
}
