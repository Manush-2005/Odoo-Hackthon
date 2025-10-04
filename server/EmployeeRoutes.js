
import express from 'express';
const EmployeeRouter = express.Router();
import * as EmployeeController from './controllers/EmployeeController.js';


// --- Expense Submission & Viewing ---

// Submit expense claims (Amount, Category, Description, Date)
EmployeeRouter.post('/expenses', EmployeeController.submitExpenseClaim);

// View their own expense history and check approval status
// :userId is inferred from the 'protect' middleware (req.user._id)
EmployeeRouter.get('/history/expenses/:employeeId', EmployeeController.getOwnExpenseHistory);

// View details of a specific expense claim
EmployeeRouter.get('/expenses/:expenseId', EmployeeController.getExpenseDetails);

// Employee can update a pending expense (e.g., attach a better receipt)
EmployeeRouter.put('/expenses/:expenseId', EmployeeController.updatePendingExpense);

// --- OCR Feature ---

// Upload a receipt for OCR auto-read (returns JSON with extracted data)
// EmployeeRouter.post('/scan-receipt', EmployeeController.scanReceiptForOCR);

export default EmployeeRouter;