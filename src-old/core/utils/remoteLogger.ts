import { ISettingsParam, Logger, ILogObject } from "tslog";
import fs from "fs";
import path from "path";

const stream = fs.createWriteStream(
  path.join(
    process.env.LOGDIR == undefined
      ? // @ts-ignore
        path.join(process.env.HOME, ".shadowlogs")
      : process.env.LOGDIR,
    "info.log"
  ),
  { flags: "w", autoClose: true }
);

function logToTransport(logObject: ILogObject) {
  const log = logObject.toJSON();
  stream.write(log.argumentsArray + '\n');
}

const remote: Logger = new Logger();

remote.setSettings(<ISettingsParam>{
  displayFilePath: "hidden",
  displayLogLevel: false,
  displayFunctionName: false,
  displayInstanceName: false,
  displayRequestId: false,
  displayTypes: false,
  displayLoggerName: false,
  displayDateTime: false,
  minLevel: "info",
});

remote.attachTransport(
  {
    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    info: logToTransport,
    warn: logToTransport,
    error: logToTransport,
    fatal: logToTransport,
  },
  "info"
);

export default remote;
