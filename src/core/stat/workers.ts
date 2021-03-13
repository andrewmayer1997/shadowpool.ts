export type Worker = {
  name: string;
  hashrate: string;
  ip: string;
  extranonce: string;
  online: boolean;
};

export const addWorker = function (data: Worker) {
  //..
};

export const makeOnline = function (name: string) {
  //..
};

export const makeOffline = function (name: string) {
  //..
};

export const getActive = function (): number {
  return 0;
};

export const getAll = function (): number {
  return 0;
};

export const updateHashrate = function (name: string, hashrate: number) {
  //..
};

export const calcPoolHashrate = function (): number {
  return 0;
};
