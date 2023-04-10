import { BitGo } from "bitgo";

const bitgo = new BitGo({ env: "test" });

// login info for your chosen environment
const supersecretinfo = {
  un: `xiao-pinghuynh@bitgo.com`,
  pw: `Y!ecYLncMDRTDC*c$H9$Si5akt0^i6DMHOih@H^B0S`,
  eid: `63f52bade277e5000771bd2fa6dbd874`,
  accessToken: `v2xba53850e80fa7af49aa1bdd63ca96f349274ce6b8feb60ca2037548c78234d3a`,
}

async function listWallet() {
  await bitgo.authenticate({
    username: supersecretinfo.un,
    password: supersecretinfo.pw,
    otp: '000000',
  });
	const gtethcoin = bitgo.coin('gteth');
  const tpolycoin = bitgo.coin('tpolygon');
	
	const gtethWallets = (await gtethcoin.wallets().list({}));
  const tpolyWallets = (await tpolycoin.wallets().list({}))
    .wallets
    .filter(wallet =>  wallet.id() === '640a041a73b4bf0006bc8f74933b54e5');
	console.log(`gteth: ${gtethWallets.wallets.length}, tpoly: ${tpolyWallets.length}`);
  const wallet = tpolyWallets[0];
  const addrs = await wallet.addresses();
  console.log(JSON.stringify(wallet, undefined, 2));
  console.log(addrs);
  console.log(wallet.receiveAddress());
  // for (const wallet of gtethWallets.wallets) {
  //   const addrs = wallet.addresses();
  //   console.log(JSON.stringify(wallet, undefined, 2));
  //   console.log(wallet.addresses())
  //   console.log(wallet.receiveAddress());
  // }
}

listWallet()