import {
  auth,
  extranonce,
  submit,
  submitHashrate,
  subscribe,
} from "../rpc/methods";
import { RpcError, jsonrpc, deserialize } from "../rpc/jsonrpc";

import log from "../utils/logger";

export const msgHandler = async function (
  data: Buffer,
  ip: string
): Promise<jsonrpc.response> {
  let req;

  try {
    req = deserialize(data.toString("ascii"));
    log.debug(`Got request:`, req);
  } catch (e) {
    log.debug("Invalid request");
    return <jsonrpc.response>{
      id: 0,
      error: <jsonrpc.error>{
        code: 400,
        message: "Unable to parse json",
        data: e,
      },
    };
  }

  try {
    switch (req.method) {
      case "mining.subscribe": {
        return subscribe(req);
      }
      case "mining.submit": {
        return submit(req);
      }
      case "mining.authorize": {
        return auth(req, ip);
      }
      case "eth_submitHashrate": {
        return submitHashrate(req, ip);
      }
      case "eth_submitLogin": {
        return auth(req, ip);
      }
      case "mining.extranonce.subscribe": {
        return extranonce(req);
      }
      default: {
        throw new RpcError(<jsonrpc.error>{
          code: 400,
          message: "Unsupport method",
          data: req.method,
        });
      }
    }
  } catch (e) {
    if (e instanceof RpcError) {
      return <jsonrpc.response>{
        id: req.id,
        error: e.rpcmsg,
      };
    } else {
      log.warn("Something went wrong");
      throw e;
    }
  }
};
