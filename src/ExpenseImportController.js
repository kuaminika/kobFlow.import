 

function ExpenseImportController({ logTool, importService,expenseService }) {
    const self = this;

    self.parseCSVExpenses = async function(req, res) {
        try {
            const { csvContent, ownerId } = req.body;

            logTool.log(" will process this csvContent:"+csvContent);
            const importedExpenses = await importService.handleCSVImport(csvContent, ownerId);
            res.json({ expenses: importedExpenses });
        } catch (error) {
            logTool.log(error);
            res.status(500).json({ error: 'Failed to import expenses' });
        }
    }

    self.doBulkInsert = async function(req, res) {
        try {
            const { expenses } = req.body;
            await expenseService.bulkInsert(expenses);

            res.json({ message: 'Bulk insert successful' });
        } catch (error) {
            logTool.log(error);
            res.status(500).json({ error: 'Failed to perform bulk insert' });
        }
    }
}

export default ExpenseImportController;
