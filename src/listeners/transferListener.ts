import { ethers } from 'ethers';
import { WebSocketProvider } from "ethers";
import prisma from "../config/db";
import { getCurrentTokenPrice } from "../services/tokenPriceService";

const infuraUrl = process.env.INFURA_WEBSOCKET_URL;
if (!infuraUrl) {
    throw new Error('INFURA_WEBSOCKET_URL environment variable is not set');
}
const provider = new WebSocketProvider(infuraUrl);

const createTransactionRecord = async (tx: any, txHash: string) => {
	const explorerUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;

	const prices = await getCurrentTokenPrice(['ETH'])
	const priceAtTx = prices['ETH'] || 0

	await prisma.transaction.create({
		data: {
			fromAddress: tx.from,
			toAddress: tx.to,
			amount: Number(ethers.formatUnits(tx.value, 18)),
			symbol: 'ETH',
			priceAtTx,
			txHash,
			explorerUrl,
		},
	})
}

export const listenToTransfers = async (walletAddress: string) => {
	const filter = {
    address: walletAddress,
    topics: [
      ethers.id("Transfer(address,address,uint256)")
    ]
  };
	provider.on(filter, async (log) => {
		try {
			console.log(log)
			const tx = await provider.getTransaction(log.transactionHash);
			// const tx = await provider.getTransaction(txHash);
			if (!tx)return
			if (!tx.to || !tx.from || tx.to !== walletAddress && tx.from !== walletAddress) return
			createTransactionRecord(tx, log.transactionHash)
		} catch (error) {
			console.error(`Error fetching transaction ${log.transactionHash}:`, error);
		}
	});
};