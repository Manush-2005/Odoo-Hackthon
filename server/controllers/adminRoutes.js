import express from "express";
import CompanyModel from "../models/AdminModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import ExpenseModel from "../models/ExpenseModel.js";



const AdminRouter = express.Router();

AdminRouter.post("/create-company", async (req, res) => {
  try {
    const company = new CompanyModel({ ...req.body, createdBy: req.user._id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


AdminRouter.get("/users", async (req, res) => {
  try {
    const users = await EmployeeModel.find({ companyId: req.user.companyId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


AdminRouter.put("/set-role/:userId", async (req, res) => {
  try {
    const user = await EmployeeModel.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


AdminRouter.put("/approval-rules/:companyId", async (req, res) => {
  try {
    const company = await CompanyModel.findByIdAndUpdate(
      req.params.companyId,
      { approvalRules: req.body },
      { new: true }
    );
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


AdminRouter.get("/expenses", async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({ companyId: req.user.companyId })
      .populate("employeeId", "name email")
      .populate("approverId", "name");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


AdminRouter.put("/override-expense/:expenseId", async (req, res) => {
  try {
    const expense = await ExpenseModel.findByIdAndUpdate(
      req.params.expenseId,
      { status: req.body.status },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default AdminRouter;
