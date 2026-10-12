import pino from "pino";
import path from "path";
const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
});

function getCallSite() {
  const err = new Error();
  const lines = err.stack?.split("\n") || [];

  // lines[0] = "Error"
  // lines[1] = getCallSite (this fn)
  // lines[2] = the log method (info/warn/etc.)
  // lines[3] = the actual caller we want
  const callerLine = lines[3] || "";

  // Matches: "    at functionName (file:line:col)" or "    at file:line:col"
  const match = callerLine.match(/at (?:(.+?) \()?(.+?):(\d+):\d+\)?$/);

  if (!match) return {};

  return {
    caller: match[1] || "<anonymous>",
    file: path.basename(match[2]),   // just the filename, not full path
    line: Number(match[3]),
  };
}

function LogTool(context={})
{
    const logger =  baseLogger.child(context);
    
    const self = this;
     self.log = (message,data={}) => { // Default to INFO level (2)
      const {caller,file,line} = getCallSite();
        data= {caller,file,line};
        logger.info(data,message);
    };
    self.markFootPrint = ()=>{
        const callSite = getCallSite();
        logger.info({footprint: callSite}, "Log footprint");

    }
    self.info = (message,data={}) => {
        data= {...data,...getCallSite()};
        logger.info(data,message );
    };

    self.error = (message,data={}) => {
        data= {...data,...getCallSite()};
        logger.error(data,message);
    };

    self.warn = (message,data={}) => {
        data= {...data,...getCallSite()}; 
        logger.warn(data,message);
    };

    self.critical = (message,data={}) => {
        data= {...data,...getCallSite()};
      
        logger.error(data,`CRITICAL: ${message}`);
    };

    self.trace = (message,data={}) => {
  
        data= {...data,...getCallSite()};
        logger.trace(data,message);
    };

    self.debug = (message,data={}) => {
  
        data= {...data,...getCallSite()};
        logger.debug(data,message);
    };

    return self;
}

export default LogTool;