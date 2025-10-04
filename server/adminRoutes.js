// admin.routes.js

import express from 'express';
const Adminrouter = express.Router();
import  * as AdminController  from './controllers/AdminController.js';



Adminrouter.post('/createAdmin', AdminController.createInitialAdminAndCompany);



Adminrouter.post('/employees', AdminController.createEmployeeController);

Adminrouter.put('/employees/:id', AdminController.updateEmployeeRoleAndManager);

// View all users in the company
Adminrouter.get('/employees/:companyId', AdminController.getAllEmployees);

// --- Expense Management Routes ---
// View all expenses
Adminrouter.get('/expenses/all', AdminController.getAllCompanyExpenses);

// Override approvals
Adminrouter.put('/expenses/:id/override', AdminController.overrideExpenseApproval);

// --- Configuration Routes ---
// Configure and save new approval rules
Adminrouter.post('/approval-rules', AdminController.createApprovalRule);

// Update existing approval rules
Adminrouter.put('/approval-rules/:id', AdminController.updateApprovalRule);

export default Adminrouter;