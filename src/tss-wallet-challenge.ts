const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import { BitGo, IWallet } from "../env/sdk";
import * as env from '../env/envStaging';
const coin = 'tpolygon';

const bitgoCoin = env.bitgo.coin(coin);
const walletPassword = '123456';

async function createWallet(enterpriseId: string): Promise<IWallet> {
	console.log("creating wallet, this might take a few seconds....");

	const wallet = await bitgoCoin
		.wallets()
		.generateWallet({
			label:  "tss polygon",
			passphrase: walletPassword,
			multisigType: 'tss',
			enterprise: enterpriseId,
			disableTransactionNotifications: "true",
			disableKRSEmail: true,
			walletVersion: 3,
			passcodeEncryptionCode: "my random string"
		});
	console.log('created wallet: ' + JSON.stringify(wallet.wallet, null, 2));

	return wallet.wallet;
}

async function sendTx(fromWallet: string, toAddress: string) {
	await env.bitgo.unlock({ otp: "000000" });
	const wallet = await bitgoCoin
		.wallets()
		.get({id : fromWallet});

	const tx = await wallet.send({
		address: toAddress,
		amount: "10000000000000",
		walletPassphrase: walletPassword,
		type: 'transfer'
	});
	console.log(tx);
}

async function createTransactionOnPendingWalletShouldFail(): Promise<void> {
	const pendingSafePrimeWalletId = env.wallets.pendingSafePrime;
	const address = '0x95fb134022b54bd72e1d739c4bf36784ac51268e';
	chai.expect(sendTx(pendingSafePrimeWalletId, address))
		.to.be.rejectedWith('pendingEcdsaTssInitialization');
}


async function main() {
	await createTransactionOnPendingWalletShouldFail();

}
main().catch((e) => console.error(e));
