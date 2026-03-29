import {AppInitiator} from "./AppInitiator.js";
import configs from './configs.js'

const initiator = new AppInitiator(configs);

initiator.init();