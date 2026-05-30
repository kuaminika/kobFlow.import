function ExpenseService({logTool,expenseApiClient }) {
    const self = this;

    self.logTool = logTool || { log: () => {} };


    self.getAllExpenses = async function(){
        expenseApiClient.setEndpoint(`/Expense`);
        self.logTool.log('Fetching all expenses');
        const response = await expenseApiClient.fetch();
        self.logTool.log(`Fetched ${response.subject.length} expenses`);
        return response.subject;
    }

    self.bulkInsert = async function(expenses) {
        expenseApiClient.setEndpoint(`/Expense/BulkAdd`);
        self.logTool.log(`Performing bulk insert of ${expenses.length} expenses`);
        self.logTool.log("expenses: " + JSON.stringify(expenses));
        return await expenseApiClient.post( expenses );
    }
}

export default ExpenseService;