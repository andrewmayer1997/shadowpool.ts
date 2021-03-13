import log from "../utils/logger";

/**
 *  ethereum-stratum2 jsonrpc-2.0 implementation
 */
export namespace jsonrpc {
  /**
   * The error field of JSONRPC request or notification
   * @example
   * <jsonrpc.error>{ code: 400, message: "Bad request", data: `Unimplemented method: ${req.method}` }
   */
  export type error = {
    /**
     * The status code of response
     * @example
     * code: 400 // Bad request
     */
    code: number;
    /**
     * Short msg of error human reading
     */
    message: string;
    /**
     * Additional data for debug
     * @example
     * catch (e) {
     *   throw new RpcError(<jsonrpc.error> {
     *     code: 400,
     *     message: "Bad request",
     *     data: e
     *   })
     * }
     */
    data?: string | Object;
  };

  export type request = {
    id: number;
    method: string;
    params?: string | number | Array<any> | Object;
    worker?: string;
    jsonrpc?: string;
  };

  export type response = {
    id: number;
    error?: error;
    result?: string | number | Array<any> | Object;
    jsonrpc?: string;
  };

  /**
   * from https://eips.ethereum.org/EIPS/eip-1571#notifications
   */
  export type notification = {
    method: string;
    params?: string | number | Array<any> | Object;
    error?: error;
    jsonrpc?: string;
  };

  export type message =
    | jsonrpc.request
    | jsonrpc.response
    | jsonrpc.notification;
}

export class RpcError extends Error {
  public readonly rpcmsg: jsonrpc.error;

  constructor(msg: jsonrpc.error) {
    super(msg.message);
    this.name = "RpcError";
    /**
     * Must contain a error for error field in response
     * @example
     * ...
     * id: 0
     * error: err.rpcmsg
     * ...
     */
    this.rpcmsg = msg;
  }
}

export const serialize = function (msg: jsonrpc.message): string {
  try {
    return JSON.stringify(msg);
  } catch (e) {
    log.debug("Cannot parse json");
    throw e;
  }
};

export const deserialize = function (obj: string): jsonrpc.message {
  try {
    let json = JSON.parse(obj);

    if (isRpcMessage(json)) {
      return json as jsonrpc.message;
    } else {
      throw new Error("This is not jsonrpc msg");
    }
  } catch (e) {
    log.debug("Cannot parse json");
    throw e;
  }
};

export const isRpcMessage = function (obj: object): boolean {
  return isNotification(obj) || isRequest(obj) || isResponse(obj)
    ? true
    : false;
};

export const isNotification = function (obj: object): boolean {
  const keys = Object.keys(obj);

  return (keys.includes("params") && keys.includes("method")) ||
    keys.includes("error")
    ? true
    : false;
};

export const isRequest = function (obj: object): boolean {
  const keys = Object.keys(obj);

  return keys.includes("id") &&
    keys.includes("method") &&
    keys.includes("params")
    ? true
    : false;
};

export const isResponse = function (obj: object): boolean {
  const keys = Object.keys(obj);

  return keys.includes("id") &&
    (keys.includes("result") || keys.includes("error"))
    ? true
    : false;
};
