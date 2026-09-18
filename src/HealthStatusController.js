function HealthStatusController({ logTool})
{
    const self = this;

    self.health =   async function(req, res){
        logTool.log("inisde health action of health controller.")
        res.send("ok");
    }
    
}

export default HealthStatusController;