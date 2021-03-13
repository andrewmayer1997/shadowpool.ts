import Web3 from "web3";
import log from "./utils/logger";

const autogenkey =
  "0x85f60765a212abec9239c327fcc38a5ece20b491e4f41073568d5c2668ccdffd";

export const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://localhost:8546")
);

export const checkConnection = async function () {
  web3.eth
    .getCoinbase()
    .then(async (val) => {
      log.info(`Wallet: ${val}`);
      log.info(
        `Balance: ${web3.utils.fromWei(
          await web3.eth.getBalance(val),
          "ether"
        )}`
      );
    })
    .catch((e) => {
      log.error(`Unable connect to geth. Exit.`);
      process.exit(1);
    });
};

export const submitWork = async function () {
  //..
};
