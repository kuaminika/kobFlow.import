import pino from "pino";

const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
});
function LogTool(context={})
{
    const logger =  baseLogger.child(context);
    
    const self = this;
     self.log = (message,data={}) => { // Default to INFO level (2)
      
        logger.info(data,message);
    };

    self.info = (message,data={}) => {
        
        logger.info(data,message );
    };

    self.error = (message,data={}) => {
       
        logger.error(data,message);
    };

    self.warn = (message,data={}) => {
       
        logger.warn(data,message);
    };

    self.critical = (message,data={}) => {
      
        logger.error(data,`CRITICAL: ${message}`);
    };

    self.trace = (message,data={}) => {
  
        logger.trace(data,message);
    };

    self.debug = (message,data={}) => {
  
        logger.debug(data,message);
    };

    return self;
}

export default LogTool;