import { Router } from "express";
import { getAuditLog, getMedications, getSingleMedication, getTransactions, postTransaction } from "../controllers/controller.js";

const router = Router()

router.get('/medications', getMedications)

router.get('/medications/:id', getSingleMedication)

router.post('/transactions', postTransaction)

router.get('/transactions', getTransactions)

router.get('/audit-log', getAuditLog)

export default router