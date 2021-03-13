import { calc as calcExtranonce } from "./extraNonce";
import log from "./utils/logger";

export type Worker = {
  name: string;
  hashrate: string;
  extranonce?: string;
  ip: string;
  online: boolean;
};

export type UID = string;

// key is worker UID(!!!)
export let workers = new Map<UID, Worker>();
//export let activeWorkers = 0;
export let UIDbyName = new Map<string, string>();
export let accepted: number = 0;

export const increaseAccepted = function () {
  accepted++;
};

export const calcPoolHashrate = function (): number {
  let poolHashrate = 0;

  workers.forEach((w, key) => {
    if (w.online) {
      poolHashrate += Number(w.hashrate);
    }
  });

  return poolHashrate;
};

export const getActiveWorkers = function (): number {
  let num = 0;
  workers.forEach((w, key) => {
    if (w.online) num++;
  });
  return num;
};

export const addWorker = function (uid: UID, data: Worker) {
  if (UIDbyName.get(data.name)) {
    if (UIDbyName.get(data.name) == uid) {
      updateHashrate(data.name, data.hashrate);
      makeOnline(data.name);
    } else {
      // @ts-ignore
      workers.delete(UIDbyName.get(data.name));
      UIDbyName.set(data.name, uid);
      workers.set(uid, data);
      calcExtranonce();
    }
    // @ts-ignore
  } else {
    UIDbyName.set(data.name, uid);
    workers.set(uid, data);
    calcExtranonce();
  }
};

export const updateHashrate = function (name: string, hashrate: string) {
  // @ts-ignore
  workers.get(UIDbyName.get(name))?.hashrate = hashrate;
};

export const makeOnline = function (name: string) {
  let UID = UIDbyName.get(name);
  if (UID && workers.get(UID)) {
    // @ts-ignore
    workers.get(UIDbyName.get(name))?.online = true;
  }
};

export const removeWorker = function (ip: string) {
  workers.forEach((w, key) => {
    if (w.ip == ip) {
      w.online = false;
      log.info(`Worker ${w.name} is offline!`);
      log.info(`Workers: ${getActiveWorkers()}/${workers.size}}`);
    }
  });
};
