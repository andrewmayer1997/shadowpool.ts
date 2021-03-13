import { ISettingsParam, Logger, ILogObject } from "tslog";
import path from "path";
import { appendFileSync } from "fs";

const logdir = path.join(process.env.HOME, ".shadowlogs", "debug.log");

function logToTransport(logObject: ILogObject) {
  appendFileSync(logdir, JSON.stringify(logObject) + "\n");
}

const log: Logger = new Logger();
log.setSettings(<ISettingsParam>{
  displayFilePath: "hidden",
  displayFunctionName: false,
  displayLoggerName: false,
  displayInstanceName: false,
  displayRequestId: false,
  displayDateTime: true,
});

log.attachTransport(
  {
    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    info: logToTransport,
    warn: logToTransport,
    error: logToTransport,
    fatal: logToTransport,
  },
  "silly"
);

export default log;
