import { Request, Response } from "express"
import prisma from "../services/prisma/prisma.js"
import { MedicationId, Schedules } from "../schemas/medications.js";
import { Transaction, TransactionQuery } from "../schemas/transactions.js";
import calculateNewQuantity from "../utils/calculateNewQuantity.js";
import { EntityType } from "../schemas/auditlog.js";

export const getMedications = async (req: Request, res: Response) => {
    const { schedule } = req.query;
    if(!schedule){
        const medications = await prisma.medication.findMany()
        return res.status(200).json(medications)
    }
    
    const parsedSchedule = Schedules.parse(schedule)

    const medication = await prisma.medication.findMany({
        where: {
            schedule: parsedSchedule
        }
    })

    return res.status(200).json(medication)
}

export const getSingleMedication = async (req: Request, res: Response) => {
    const { id } = req.params
    const parseId = MedicationId.parse(id)

    const medication = await prisma.medication.findUnique({
        where: {
            id: parseId
        },
        include: {
            transaction: true
        }
    })

    if(!medication)
        throw new Error("Medication not found", { cause: "404" })

    return res.status(200).json(medication)
}

export const postTransaction = async (req: Request, res: Response) => {
    const body = req.body
    const { nurseId, witnessId, medicationId, quantity, type, notes } = Transaction.parse(body)
   
    if(nurseId === witnessId)
        throw new Error("Nurse id and witness id has to be different", { cause: "400" })

    const nurse = await prisma.user.findUnique({ where: { id: nurseId } })
    const witness = await prisma.user.findUnique({ where: { id: witnessId } })
    if (!nurse || nurse.role !== "NURSE") 
        throw new Error("The nurse ID provided does not belong to a nurse", { cause: "400" })
    
    if (!witness || witness.role !== "WITNESS") 
        throw new Error("The witness ID does not belong to a witness", { cause: "400" })

    await prisma.$transaction(async (tx) => {
        const medication = await tx.medication.findUnique({ where: { id: medicationId }})
        if(!medication)
            throw new Error("Medication not found", { cause: "404" })

        if(type === "CHECKOUT"){
            const updated = await tx.medication.updateMany({
                where: { id: medicationId, currentStockQuantity: { gte: quantity } },
                data: { currentStockQuantity: { decrement: quantity } }
            })

            if(updated.count === 0)
                throw new Error("There is not enough quantity in stock", { cause: "409" })
        }
        else if(type === 'RETURN'){
            await tx.medication.update({
                where:{ id: medicationId },
                data: { currentStockQuantity: { increment: quantity } }
            })
        }

        const updatedMedication = await tx.medication.findUnique({ where: { id: medicationId } })

        const createdTransaction = await tx.transaction.create({
            data: { medicationId, nurseId, witnessId, type, quantity, notes }
        })

        await tx.auditLog.create({
            data: {
                action: "CREATED_TRANSACTION",
                entityType: "Transaction",
                entityId: createdTransaction.id,
                performedBy: nurse.id,
                details: {
                    oldStockQuantity: medication.currentStockQuantity,
                    newStockQuantity: updatedMedication?.currentStockQuantity,
                    unit: medication.unit,
                    nurseId: nurse.id,
                    witnessId: witness.id,
                    notes: createdTransaction.notes
                }
            }
        })
    })

    return res.status(201).json({ message: "Successfully created transaction" })
}

export const getTransactions = async (req: Request, res: Response) => {
    const query = req.query

    const { type, medicationId } = TransactionQuery.parse(query)
    
    const transactions = await prisma.transaction.findMany({
        where: {
            ...(type && { type }),
            ...(medicationId && { medicationId })
        }
    })

    return res.status(200).json(transactions)
}

export const getAuditLog = async (req: Request, res: Response) => {
    const { entityType } = req.query;
    if(!entityType){
        const allAuditLogs = await prisma.auditLog.findMany()
        return res.status(200).json(allAuditLogs)
    }
    
    const parsedEntityType = EntityType.parse(entityType)

    const auditLogs = await prisma.auditLog.findMany({
        where: {
           entityType: parsedEntityType
        }
    })

    return res.status(200).json(auditLogs)
}