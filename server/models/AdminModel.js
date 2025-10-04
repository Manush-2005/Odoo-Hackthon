import AdminSchema from "./schema/AdminSchema.js";
import mongoose from "mongoose";

const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;
