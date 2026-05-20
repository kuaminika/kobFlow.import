function ImportService({csvParser,    
    merchantLookupService,
    logTool,
    defaultValues
    }) {

    const self = this;
 
    this.handleCSVImport= async function(csvContent,ownerId)
    {
        const mappings = {};
        const expenses = csvParser.parseCSVContent(csvContent);
        for(const expense of expenses)
        {
        
          const merchantLookUp =await merchantLookupService.lookup(expense.description);
      
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