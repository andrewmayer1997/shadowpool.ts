import "../server";
import { workers, accepted, getActiveWorkers } from "../stats";
import { whoMinedLastBlock, lastBlock, shares } from "../daemon";
import { calcPoolHashrate } from "../stats";
import { web3 } from "../daemon";
import "../utils/network";
import { getStat, GH, netstat } from "../utils/network";
import remote from "../utils/remoteLogger";

export const getBlocktime = async function (stat: netstat): Promise<number> {
  //remote.info(calcPoolHashrate());
  return Number((stat.hashrate / calcPoolHashrate()) * stat.blocktime);
};

export let lastBlockAt = new Date();

export const updateLastBlockDate = function (date: string) {
  lastBlockAt = new Date(date);
};

export const calcBlocksFromShares = function () {
  let total = 0;
  shares.forEach((s, key) => {
    if (s.isBlock) total++;
  });
  return total;
};

export const prettyTime = function (sec: number): string {
  return sec > 60 * 60 * 24
    ? (sec / (60 * 60 * 24)).toPrecision(4) + "d"
    : sec > 60 * 60
    ? (sec / (60 * 60)).toPrecision(2) + "h"
    : sec > 60
    ? (sec / 60).toPrecision(2) + "m"
    : sec < 0
    ? "?"
    : sec.toPrecision(2) + "s";
};

const update = async function () {
  getStat().then(async (stat) => {
    console.clear();
    const blocktime = await getBlocktime(stat);
    const passed =
      (Number(new Date()) -
        Number(lastBlockAt == undefined ? 100000000000000000 : lastBlockAt)) /
      1000;
    const progress = Math.floor(passed < 0 ? 0 : (passed / blocktime) * 100);
    const hashrate = Math.floor(calcPoolHashrate() / 10000) / 100; //MH
    const wallet = await web3.eth.getCoinbase();

    remote.info(`------------- ${new Date()} -------------`);
    remote.info(`Wallet: ${wallet}`);
    remote.info(
      `Balance: ${web3.utils.fromWei(
        await web3.eth.getBalance(wallet),
        "ether"
      )}`
    );
    remote.info(`Hashrate: ${hashrate < 0 ? "?" : hashrate.toString() + "MH"}`);
    //console.log(`Hashrate(2): ${(await web3.eth.getHashrate()) / 1000000} MH`);
    remote.info(`Workers: ${getActiveWorkers()}/${workers.size}`);
    remote.info(`Last block: ${lastBlock}`);
    remote.info(`Mined by: ${whoMinedLastBlock}`);
    //1 == 1 ? 2 : 2 == 2 ? 3 : 0;
    //remote.info(`Expected block time: ${prettyTime(blocktime)}`);
    remote.info(`Expected block time: ${prettyTime(blocktime)}`);
    remote.info(`Time passed: ${prettyTime(passed)}`);
    remote.info(`Progress: ${progress < 0 ? "?" : progress.toString() + "%"}`);
    remote.info(`Total shares: ${accepted}/${calcBlocksFromShares()}`);
    remote.info("");
  });
};

export const view = function () {
  setInterval(update, 1000);
};
