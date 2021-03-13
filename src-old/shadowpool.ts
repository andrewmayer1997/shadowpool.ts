import "./core/server";
import { stratum } from "./core/server";
import "./core/daemon";
import { start } from "./core/daemon";
import { view } from "./core/view/ttyout";
import remote from "./core/utils/remoteLogger";
import log from "./core/utils/logger";
//import { back } from "./core/view/server";

process.on("uncaughtException", function (err) {
  log.error("Caught exception: \n" + JSON.stringify(err));
  remote.fatal(`<----------------- ERROR! ----------------->`);
  remote.fatal(JSON.stringify(err));
  remote.fatal(`<----------------- ERROR! ----------------->`);
  process.exit(1);
});

process.on("unhandledRejection", function (err) {
  log.error("Caught rejection: \n" + JSON.stringify(err));
  remote.fatal(`<----------------- ERROR! ----------------->`);
  remote.fatal(JSON.stringify(err));
  remote.fatal(`<----------------- ERROR! ----------------->`);
  process.exit(1);
});

stratum.create(8008, "0.0.0.0");
//back.createWebSocket(2002)
start();
view();
