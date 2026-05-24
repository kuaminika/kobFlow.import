import dotenv from 'dotenv';
dotenv.config();
const port = process.env.HTTP_PORT;
const host = process.env.DB_HOST; 
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PWD;
const dbport = process.env.DB_PORT;
const dbSettings = {host,user,database,password,dbport};

const defaultOrgId = process.env.DEFAULT_ORG_ID;
const otherSettings = {EXPENSE_API_BASE_URL:process.env.EXPENSE_API_BASE_URL};
export default {...dbSettings,port,defaultOrgId,
     serviceName:process.env.SERVICE_NAME, 
     applicationName:process.env.APPLICATION_NAME,
     corsOrigin:process.env.CORS_ORIGIN, ...otherSettings};