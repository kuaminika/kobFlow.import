
import LogTool from "../LogTool.js";
import APIClient from "../util/APIClient.js";
import ExpenseService from "../services/ExpenseService.js";


function ExpenseServiceCreator({logTool,configs}) {

    const self = this;
    const _private = {};
    _private.logTool = logTool|| new LogTool();

    self.create = function(){
        const expenseApiClient= new APIClient({
            clientTypeModel: {
                 baseUrl: configs.EXPENSE_API_BASE_URL, 
                 url: '/Expense'},
                apiKey: configs.EXPENSE_API_KEY
        }); 
        const expenseService = new ExpenseService({ logTool: _private.logTool, expenseApiClient });
        return expenseService;
    }

}

export default ExpenseServiceCreator;