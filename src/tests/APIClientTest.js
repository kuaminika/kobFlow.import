import 'dotenv/config';
import APIClient from "../util/APIClient.js";



const merchantClient = new APIClient({
    clientTypeModel: { url: 'https://dev.korosol.com/kobFlow_dev/KobFlowAPIGateWay/API/index.php?context=Flows&requestAction=getAll&sourceContext=Merchant' },
    apiKey: 'test-key'
});


const result = await merchantClient.fetchAll();

console.log("API Client Test Result:", result);