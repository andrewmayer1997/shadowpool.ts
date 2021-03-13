import { jsonrpc } from "../rpc/jsonrpc";
import { calcPoolHashrate, getActive, getAll } from "../stat/workers";
import { web3 } from "../web3";

export const getPoolHashrate = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: calcPoolHashrate(),
  };
};

export const getWallet = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: await web3.eth.getCoinbase(),
  };
};

export const getBalance = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: await web3.eth.getBalance(await web3.eth.getCoinbase()),
  };
};

export const getAllWorkers = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: getAll(),
  };
};

export const getActiveWorkers = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: getActive(),
  };
};
