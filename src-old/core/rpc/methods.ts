import { shares, submitWork } from "../daemon";
import { jsonrpc } from "./jsonrpc";
import log from "../utils/logger";
import "../stats";
import { addWorker, Worker, makeOnline, increaseAccepted } from "../stats";
//import { botNewBlockNotify } from "../../../watch/bot";

export const submit = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  const isBlock = await submitWork(
    //@ts-ignore
    req.params[1],
    // @ts-ignore
    req.params[2],
    req.worker!.toString()
  );
  log.info(
    // @ts-ignore
    `Checked the share: -- ${isBlock}`
  );
  // @ts-ignore
  shares.get(req.params[1])!.isBlock = isBlock;
  increaseAccepted();
  //@ts-ignore
  makeOnline(req.worker);
  //if (isBlock) {
  //  botNewBlockNotify();
  //}
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};

export const auth = async function (
  req: jsonrpc.request,
  ip: string
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const extranonce = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};

export const submitHashrate = async function (
  req: jsonrpc.request,
  ip: string
): Promise<jsonrpc.response> {
  // @ts-ignore
  addWorker(req.params[1], <Worker>{
    name: req.worker!.toString(),
    // @ts-ignore
    hashrate: req.params[0],
    ip: ip,
    online: true,
  });
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const subscribe = async function (
  req: jsonrpc.request
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
