import { getActiveWorkers, workers } from "./stats";
import { stratum } from "./server";
import { jsonrpc } from "./rpc/jsonrpc";
import log from "../core/utils/logger";

const Min = 0x00;
const Max = 0xff;

export const calc = function () {
  const step = Math.floor(Max / getActiveWorkers());
  let last = 0 - step;

  workers.forEach((w, key) => {
    if (w.online) {
      const extraNonce = Math.floor(last + step)
        .toString(16)
        .padStart(2, "0");

      stratum.sendNotifyTo(w.ip, <jsonrpc.notification>{
        method: "mining.set_extranonce",
        params: ["0x" + extraNonce],
      });
      w.extranonce = extraNonce;
      last += step;
      log.debug(`Worker: ${w.name}, start at ${w.extranonce}, step ${step}`);
    } else {
      log.debug(`Worker with ${key} UID is offline!`);
    }
  });
};
