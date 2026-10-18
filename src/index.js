import {AppInitiator} from "./AppInitiator.js";
import configs from './configs.js'
import LogTool from "./LogTool.js";

const logTool = new LogTool();
const initiator = new AppInitiator(configs);

// Exit on startup failure so PM2 / Docker restart the service instead of leaving it half-started.
initiator.init().catch(error => {
    logTool.critical(`Startup failed: ${error.message}`, { stack: error.stack });
    process.exit(1);
});
