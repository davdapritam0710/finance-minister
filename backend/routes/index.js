import express from "express";
const router = express.Router();

import userRoutes from "./userRoutes.js";
import kycRoutes from "./kycRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import banksRoutes from "./banksRoutes.js";

router.use("/users", userRoutes);
router.use("/kyc", kycRoutes);
router.use("/transactions", transactionRoutes);
router.use("/banks", banksRoutes);

export default router;
