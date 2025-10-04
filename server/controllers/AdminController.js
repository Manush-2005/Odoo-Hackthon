import AdminModel from '../models/AdminModel.js';
import EmployeeModel from '../models/EmployeeModel.js';
import ExpenseModel from '../models/ExpenseModel.js';





export const createInitialAdminAndCompany = async (req, res) => {
    const { 
        companyName, 
        countryCode, 
        adminName, 
        adminEmail, 
    } = req.body;

    
    const defaultCurrency = countryCode === 'US' ? 'USD' : 'EUR'; 

 

    const newAdmin = await AdminModel.create({
        name: companyName,
        defaultCurrency,
        countryCode,
    });

  
    newAdmin.companyId = newAdmin._id;
    await newAdmin.save();


    res.status(201).json({
        status: 'success',
        message: ' primary Admin user created successfully.',
        data: {
            admin: newAdmin
        }
    });
};






























// --- User Management Controllers ---

// Create a new Employee or Manager
export const createEmployeeController = async (req, res) => {
    try {
        const { name, email, role, managerId, isManagerApprover, companyId } = req.body;
        

        const newEmployee = await EmployeeModel.create({
            companyId,
            name,
            email,
            role: role || 'Employee',
            managerId: managerId || null,
            isManagerApprover: isManagerApprover !== undefined ? isManagerApprover : true
        });

        res.status(201).json({
            status: 'success',
            data: { employee: newEmployee }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update Employee's role and manager relationship
export const updateEmployeeRoleAndManager = async (req, res) => {
    try {
        const { role, managerId, companyId } = req.body;

        const updatedEmployee = await EmployeeModel.findOneAndUpdate(
            { _id: req.params.id, companyId },
            { role, managerId },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: { employee: updatedEmployee }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all employees/users for the company
export const getAllEmployees = async (req, res) => {
    try {
        const { companyId } = req.params;
        const employees = await EmployeeModel.find({ companyId }).select('-password');

        res.status(200).json({
            status: 'success',
            results: employees.length,
            data: { employees }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- Expense Management Controllers ---

// Get all expenses for the company
export const getAllCompanyExpenses = async (req, res) => {
    try {
        const { companyId } = req.query;
        const expenses = await ExpenseModel.find({ companyId })
            .populate('employeeId', 'name email');

        res.status(200).json({
            status: 'success',
            results: expenses.length,
            data: { expenses }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Override approval status of an expense
export const overrideExpenseApproval = async (req, res) => {
    try {
        const { status, comments, companyId, adminId } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "Approved" or "Rejected".' });
        }

        const updatedExpense = await ExpenseModel.findOneAndUpdate(
            { _id: req.params.id, companyId },
            {
                currentStatus: status,
                $push: {
                    approvalWorkflow: {
                        approverId: adminId,
                        sequence: 999,
                        status: status,
                        comments: `Admin Override: ${comments || 'No comment provided.'}`,
                        approvalDate: Date.now()
                    }
                }
            },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        res.status(200).json({
            status: 'success',
            message: `Expense approval successfully overridden to ${status}.`,
            data: { expense: updatedExpense }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- Configuration Controllers ---

// Create a new approval rule for the company
export const createApprovalRule = async (req, res) => {
    try {
        const { name, type, value, specificApproverId, companyId } = req.body;

        const newRule = {
            name,
            type,
            value,
            specificApproverId: specificApproverId || null
        };

        const company = await AdminModel.findByIdAndUpdate(
            companyId,
            { $push: { approvalRules: newRule } },
            { new: true, runValidators: true }
        );

        res.status(201).json({
            status: 'success',
            data: { rule: company.approvalRules.slice(-1)[0] }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an existing approval rule
export const updateApprovalRule = async (req, res) => {
    try {
        const { name, type, value, specificApproverId, companyId } = req.body;
        const ruleId = req.params.id;

        const company = await AdminModel.findOneAndUpdate(
            { _id: companyId, 'approvalRules._id': ruleId },
            {
                $set: {
                    'approvalRules.$.name': name,
                    'approvalRules.$.type': type,
                    'approvalRules.$.value': value,
                    'approvalRules.$.specificApproverId': specificApproverId || null
                }
            },
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({ message: 'Company or approval rule not found.' });
        }

        const updatedRule = company.approvalRules.id(ruleId);

        res.status(200).json({
            status: 'success',
            data: { rule: updatedRule }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};