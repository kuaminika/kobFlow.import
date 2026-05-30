
import { parse } from 'csv-parse/sync';
import ExpenseModel from '../models/ExpenseModel.js';
class CSVParser{

    constructor( {logTool})
    {
        this.logTool = logTool;
    }

    parseCSVContent(csvContent)
    {
        this.logTool.log("about to parse CSV Content" );
        // Parse CSV
        const records = parse(csvContent, {
            columns: true, // returns each row as an object
            skip_empty_lines: true,
        });
        
        // Map CSV rows to ExpenseModel
        const expenses = records.map((row, index) => {
                // Clean up weird BOM character in first column
                const filter = row['ï»¿Filter'] || row['Filter'] || '';

                // Convert string to float
                const amount = parseFloat(row['Amount']);

                return new ExpenseModel({
                    id: index + 1,
                    description: row['Description'],
                    ownerId: 0, // default; you can assign if you have owner info
                    amount: amount,
                    merchantId: 0, // optional
                    merchantName: row['Sub-description'],
                    createdDate: new Date(row['Date']),
                    kobHolderName: '', // optional
                    kobHolderId: 0, // optional
                    categoryId: 0, // optional
                    categoryName: row['Type of Transaction']
                });
        });

        return expenses;
    }


}

export default CSVParser;