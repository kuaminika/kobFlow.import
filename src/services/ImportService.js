function ImportService({csvParser,    
    merchantLookupService,
    logTool,
    defaultValues
    }) {

    const self = this;
 
    this.handleCSVImport= async function(csvContent,ownerId)
    {
        logTool.log("handleCSVImport called with ownerId: " + ownerId);
        logTool.log("csvContent received: " + csvContent);
    
        const mappings = {};
        const expenses = csvParser.parseCSVContent(csvContent);
        logTool.log("parsed expenses count: " + expenses.length);
        logTool.log("parsed expenses: " + JSON.stringify(expenses));
        for(const expense of expenses)
        {
        
          logTool.log("processing expense: " + JSON.stringify(expense));
          const merchantLookUp =await merchantLookupService.lookup({ description: expense.description, ownerId });
      
          if(merchantLookUp)
          {

             mappings[expense.description] = {
                merchantId:merchantLookUp.merchantId,
                merchantName: merchantLookUp.merchantName,
                confidence: merchantLookUp.score || 1,
                confirmedByUser: false
            }

            expense.merchantId = merchantLookUp.merchantId;
            expense.merchantName = merchantLookUp.merchantName;
            expense.categoryId = defaultValues.DEFAULT_CATEGORY_ID;
            expense.kobHolderId = defaultValues.KOB_HOLDER_ID;
          }
          else 
          {
            expense.merchantId = defaultValues.DEFAULT_MERCHANT_ID;
            expense.categoryId = defaultValues.DEFAULT_CATEGORY_ID;
            expense.kobHolderId = defaultValues.KOB_HOLDER_ID;
            logTool.log(`No merchant found for "${expense.description}", using default merchant ID ${defaultValues.DEFAULT_MERCHANT_ID}`);
            logTool.log(`Consider adding a mapping for "${expense.description}" to improve future classification.`);
            logTool.log(`Expense details: ${JSON.stringify(expense)}`);
          }

        }

        await merchantLookupService.updateMappings(mappings,ownerId);
        return expenses;

    }
}

export default ImportService;
