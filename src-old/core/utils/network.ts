import { web3 } from "../daemon";
import log from "./logger";

export interface netstat {
  hashrate: number;
  blocktime: number;
  diff: number;
}

export const TH = 1000000000000;
export const GH = 1000000000;
export const MH = 1000000;

export const getStat = async function (): Promise<netstat> {
  return new Promise<netstat>((res, rej) => {
    web3.eth.getBlock("latest").then((h) => {
      res(<netstat>{
        hashrate: h.difficulty / Number(h.timestamp),
        blocktime: h.timestamp,
        diff: h.difficulty,
      });
    });
  });
};
