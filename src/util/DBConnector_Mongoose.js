import mongoose from 'mongoose';

function DBConnector_Mongoose({logTool,config}) {

  const self = this;
  const _private = {};
  _private.MONGO_URI= `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}/${config.MONGO_DB_NAME}?appName=${config.MONGO_CLUSTER_NAME}&retryWrites=true&w=majority`;
  self.logTool = logTool;
  self.config = config;
  self.connect = async function() {
    self.logTool.log("process.env.HTTP_PORT:" + self.config.port);
    self.logTool.log("process.env.MONGO_URI:" + _private.MONGO_URI);
    await mongoose.connect(_private.MONGO_URI);
    self.logTool.log('MongoDB connected');
 
  }
    
}

 export default DBConnector_Mongoose;