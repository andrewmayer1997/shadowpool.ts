import Web3 from "web3";
import http from "http";
import { stratum } from "./server";
import { jsonrpc, RpcError } from "./rpc/jsonrpc";
import log from "./utils/logger";
import { UIDbyName, workers } from "../core/stats";
import { updateLastBlockDate } from "./view/ttyout";
import { watch } from "../../watch/observer";

const autogenkey =
  "0x85f60765a212abec9239c327fcc38a5ece20b491e4f41073568d5c2668ccdffd";

export const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://localhost:8546")
);

const checkConnection = async function () {
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

export let whoMinedLastBlock = "";
export let lastBlock = "";

export const newHeaderSub = async function () {
  web3.eth.subscribe("newBlockHeaders", async (err, block) => {
    if (
      block.miner.toLowerCase() == (await web3.eth.getCoinbase()).toLowerCase()
    ) {
      updateLastBlockDate(new Date().toLocaleString());
      log.info(`Found new block ${block.hash}`);
      log.info(
        `Balance: ${web3.utils.fromWei(
          await web3.eth.getBalance(await web3.eth.getCoinbase()),
          "ether"
        )}`
      );
      watch.emit("block");
      whoMinedLastBlock = "<shadowpool>";
    } else {
      log.info(`New block: ${block.number}`);
      log.info(`Mined by ${block.miner}`);
      whoMinedLastBlock = block.miner;
    }
    lastBlock = block.number.toString(10);
  });
};

const timeoutForTestNet = function () {
  setTimeout(() => {
    web3.eth.getWork().then((data) => {
      stratum.sendNotify(<jsonrpc.notification>{
        method: "mining.notify",
        params: [(shares.size + 1).toString(), data[1], data[0], true],
      });
      shares.set((shares.size + 1).toString(), <Share>{
        powhash: data[0],
        seedhash: data[1],
      });
    });
  }, 15000);
};

export const start = function () {
  checkConnection().then(() => {
    timeoutForTestNet();
    newHeaderSub();
    http
      .createServer((req, res) => {
        req.on("data", (data: Buffer) => {
          newWorkHandler(data);
        });
      })
      .listen(4444, "localhost");
  });
};

type Share = {
  powhash: string;
  isBlock?: boolean;
};

export const shares = new Map<string, Share>();

const newWorkHandler = function (raw: Buffer) {
  const data = JSON.parse(raw.toString());

  stratum.sendNotify(<jsonrpc.notification>{
    method: "mining.notify",
    params: [(shares.size + 1).toString(), data[1], data[0], true],
  });
  shares.set((shares.size + 1).toString(), <Share>{
    powhash: data[0],
  });
};

export const submitWork = async function (
  id: string,
  nonce: string,
  name: string
): Promise<boolean> {
  let extranonce: string = "";
  let UID: string;

  const genNonce = function (): string {
    if (nonce.length == 16) {
      return "0x" + nonce;
    } else {
      return "0x" + String(extranonce + nonce).padStart(16, "0");
    }
  };

  try {
    if (!UIDbyName.get(name)) {
      //throw new Error(`This worker doesn't exist!`);
      log.error(`Got share from ??? worker, try submit without extranonce`);
      return web3.eth.submitWork(
        genNonce(),
        //@ts-ignore
        shares.get(id)!.powhash,
        //@ts-ignore
        autogenkey
      );
    } else {
      //@ts-ignore
      UID = UIDbyName.get(name)?.toString();
    }
    if (!workers.get(UID)) {
      console.log(`Got share from ??? worker, try submit without extranonce`);
      return web3.eth.submitWork(
        genNonce(),
        // @ts-ignore
        shares.get(id)!.powhash,
        // @ts-ignore
        autogenkey
      );
    } else {
      // @ts-ignore
      extranonce = workers.get(UID)?.extranonce;
    }

    log.debug(`Full nonce: ${genNonce()}`);
    log.debug(`Length: ${genNonce().length}`);

    return web3.eth.submitWork(
      genNonce(),
      shares.get(id)!.powhash,
      // @ts-ignore
      autogenkey
    );
  } catch (e) {
    log.error(`Err:`, JSON.parse(e));
    //throw new RpcError(<jsonrpc.error>{
    //  code: 400,
    //  message: "",
    //  data: e,
    //});
    return false;
  }
};
