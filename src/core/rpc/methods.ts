import { jsonrpc } from "./jsonrpc";

export const auth = async function (
  req: jsonrpc.request,
  ip: string
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const extranonce = async function (req: any): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const submit = async function (req: any): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const submitHashrate = async function (
  req: any,
  ip: string
): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
export const subscribe = async function (req: any): Promise<jsonrpc.response> {
  return <jsonrpc.response>{
    id: req.id,
    result: true,
  };
};
