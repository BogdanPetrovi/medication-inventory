import { Request, Response } from "express"
import prisma from "../services/prisma/prisma.js"
import { MedicationId, Schedules } from "../schemas/medications.js";
import { Transaction, TransactionQuery } from "../schemas/transactions.js";
import { EntityType } from "../schemas/auditlog.js";
import { Pagination } from "../schemas/shared.js";
import AppError from "../utils/AppError.js";

export const getMedications = async (req: Request, res: Response) => {
    const query = req.query

    const { limit, offset } = Pagination.parse(query)

    if(!query.schedule){
        const medications = await prisma.medication.findMany({
            take: limit,
            skip: offset,
            orderBy: { id: "asc" }
        })
        return res.status(200).json(medications)
    }
    
    const parsedSchedule = Schedules.parse(query.schedule)

    const medication = await prisma.medication.findMany({
        take: limit,
        skip: offset,
        orderBy: { id: "asc" },
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
        throw new AppError("Medication not found", 404)

    return res.status(200).json(medication)
}

export const postTransaction = async (req: Request, res: Response) => {
    const body = req.body
    const { nurseId, witnessId, medicationId, quantity, type, notes } = Transaction.parse(body)
   
    if(nurseId === witnessId)
        throw new AppError("Nurse id and witness id has to be different", 400)

    const nurse = await prisma.user.findUnique({ where: { id: nurseId } })
    const witness = await prisma.user.findUnique({ where: { id: witnessId } })
    if (!nurse || nurse.role !== "NURSE") 
        throw new AppError("The nurse ID provided does not belong to a nurse", 400)
    
    if (!witness || witness.role !== "WITNESS") 
        throw new AppError("The witness ID does not belong to a witness", 400)

    await prisma.$transaction(async (tx) => {
        const medication = await tx.medication.findUnique({ where: { id: medicationId }})
        if(!medication)
            throw new AppError("Medication not found", 404)

        if(type === "CHECKOUT"){
            const updated = await tx.medication.updateMany({
                where: { id: medicationId, currentStockQuantity: { gte: quantity } },
                data: { currentStockQuantity: { decrement: quantity } }
            })

            if(updated.count === 0)
                throw new AppError("There is not enough quantity in stock", 409)
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
    const { offset, limit } = Pagination.parse(query)
    
    const transactions = await prisma.transaction.findMany({
        take: limit,
        skip: offset,
        orderBy: { id: "desc" },
        where: {
            ...(type && { type }),
            ...(medicationId && { medicationId })
        }
    })

    return res.status(200).json(transactions)
}

export const getAuditLog = async (req: Request, res: Response) => {
    const query = req.query;

    const { offset, limit } = Pagination.parse(query)

    if(!query.entityType){
        const allAuditLogs = await prisma.auditLog.findMany({
            take: limit,
            skip: offset,
            orderBy: { id: "desc" }
        })
        return res.status(200).json(allAuditLogs)
    }
    
    const parsedEntityType = EntityType.parse(query.entityType)

    const auditLogs = await prisma.auditLog.findMany({
        take: limit,
        skip: offset,
        orderBy: { id: "desc" },
        where: {
           entityType: parsedEntityType
        }
    })

    return res.status(200).json(auditLogs)
}