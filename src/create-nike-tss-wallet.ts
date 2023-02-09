// import { BitGo } from "bitgo";
import { BitGo } from "@bitgo-beta/bitgo";
// import { BitGo } from "../../BitGoJS/modules/bitgo/dist/src/index";
import * as inquirer from "inquirer";

const bitgo = new BitGo({ env: "test" });

// login info for your chosen environment
const supersecretinfo = {
  un: `username`,
  pw: `password`,
  eid: `enterprise id`,
}

async function createWallet(params: BasePrompt & CreateWalletPrompt) {
	const bitgoCoin = bitgo.coin('tpolygon');
	console.log("\n\ncreating wallet, this might take a few seconds....");
	await bitgo.unlock({ otp: "000000" });
	const res = await bitgoCoin.wallets().generateWallet({
		enterprise: supersecretinfo.eid,
		label:  params.label ? params.label : "TSS wallet " + new Date().toString(),
		passphrase: supersecretinfo.eid,
		multisigType: 'tss',
		walletVersion: 3,
	});
	console.log(res);
	console.log("walletId", res.wallet.id());
}

const basePrompt = [
	{
		type: "input",
		name: "loginEmail",
		message: "BitGo testnet login email:",
		validate: async function (email) {
			try {
				await bitgo.authenticate({
					username: supersecretinfo.un,
					password: supersecretinfo.pw,
					otp: "000000",
				});
				const user = await bitgo.me();
				console.log(`welcome back ${user.name.full}`);
				return true;
			} catch (e) {
				return `Failed to authenticate, ${e}`;
			}
		},
	},
];

type BasePrompt = {
	loginEmail: string;
}

const createWalletPrompt = [
	{
		type: "input",
		name: "enterpriseId",
		message: "BitGo testnet enterpriseId:",
		validate: async function (enterpriseId, answers) {
			try {
				const enterprise = await bitgo.get(
					bitgo.url(`/enterprise/${supersecretinfo.eid}`, 2)
				);
				console.log(` enterprise ${enterprise.body.name}`);
				return true;
			} catch (e) {
				return `Failed to fetch enterprise, ${e}`;
			}
		},
	},
	{
		type: "input",
		name: "label",
		message: "Use a custom wallet label? (optional) ",
	}
];

type CreateWalletPrompt = {
	enterpriseId: string;
	label?: string;
	user2Email?: string;
}

if (require.main === module) {
	inquirer.prompt(basePrompt).then(async (base: BasePrompt) => {
		while (true) {
			await bitgo.authenticate({
				username: supersecretinfo.un,
				password: supersecretinfo.pw,
				otp: "000000",
			});
			await inquirer
				.prompt(createWalletPrompt)
				.then(async (params: CreateWalletPrompt) => {
					console.log(`\n\n`);
					await createWallet({
						...base,
						...params,
					});
			});
		}
	});
}
