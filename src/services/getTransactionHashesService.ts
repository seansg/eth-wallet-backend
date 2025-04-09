import axios from "axios";
import { ethers } from "ethers";
import { getPriceAtTime } from './tokenPriceService'
import prisma from '../config/db'

const createTransactionRecord = async (tx: any) => {
	const transaction = await prisma.transaction.findUnique({
		where: { txHash: tx.hash },
	})

	if (transaction) return

	const explorerUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;

	const prices = await getPriceAtTime('ETHUSDT', Number(tx.timeStamp))
	const priceAtTx = Number(prices?.closePrice || 0)

	await prisma.transaction.create({
		data: {
			fromAddress: tx.from,
			toAddress: tx.to,
			amount: Number(ethers.formatUnits(tx.value, 18)),
			symbol: 'ETH',
			priceAtTx,
			txHash: tx.hash,
			explorerUrl,
		},
	})
}

const getTransactionHashes = async (network: string, address: string) => {
  const url = `https://api-${network}.etherscan.io/api`;
	const params = {
    module: "account",
    action: "txlist",
    address: address,
    startblock: 0,
    endblock: 99999999,
    sort: "asc",
    apikey: process.env.ETHERSCAN_API_KEY,
  };

  const response = await axios.get(url, { params });
  const transactions = response.data.result;
  transactions.forEach((tx: any) => {
    createTransactionRecord(tx)
  })
};

export default getTransactionHashes;
