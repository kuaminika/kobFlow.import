import mongoose from 'mongoose';

function DBConnector_Mongoose({logTool,config}) {

  const self = this;
  self.logTool = logTool;
  self.config = config;
  self.connect = async function() {
    self.logTool.log("process.env.HTTP_PORT:",self.config.HTTP_PORT);
    self.logTool.log("process.env.MONGO_URI:",self.config.MONGO_URI);
    await mongoose.connect(self.config.MONGO_URI);
    self.logTool.log('MongoDB connected');
  }
    
}

 export default DBConnector_Mongoose;