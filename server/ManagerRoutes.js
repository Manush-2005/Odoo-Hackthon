// manager.routes.js

import express from 'express';
const ManagerRouter = express.Router();
import * as ManagerController from './controllers/ManagerController.js';



// --- Approval Workflow Management ---

// View expenses waiting for the current manager's approval step
ManagerRouter.get('/approvals/pending/:employeeId', ManagerController.getExpensesPendingApproval);

// View expenses submitted by the manager's direct reports (View team expenses)
ManagerRouter.get('/team-expenses', ManagerController.getTeamExpenses);

// Approve the expense at the manager's current sequence step
// Note: This must push to the approvalWorkflow array and update currentStatus if final.
ManagerRouter.put('/expenses/:expenseId/approve', ManagerController.approveExpense);

// Reject the expense at the manager's current sequence step (with comments)
ManagerRouter.put('/expenses/:expenseId/reject', ManagerController.rejectExpense);

// --- Utility ---

// Fetch necessary currency conversion rates (to show amount in company's default currency)
ManagerRouter.get('/currency-rates/:baseCurrency', ManagerController.getConversionRates);

export default ManagerRouter;