import express from "express";
import cors from "cors";
import { Router } from "express";
const router = Router();
function AppInitiator(configs)
{
    const self = this;
    const config = configs;
    self.init = function(){
            /**
             you can set up the router here for example:
               
        router.get("/logs", logController.getAllLogs);
        router.get("/logs/:id", logController.getLogById);
             */

        
        const app = express();

    }
}

export {AppInitiator}