import { TransactionTypes } from '../generated/prisma/client.js'
import { z } from 'zod'

export const Transaction = z.object({
    medicationId: z.number(),
    nurseId: z.number(),
    witnessId: z.number(),
    type: z.enum(TransactionTypes),
    quantity: z.number(),
    notes: z.string().optional()
}).superRefine((data, ctx)=> {
    if(data.type === TransactionTypes.WASTE && (!data.notes || data.notes.trim().length === 0)){
        ctx.addIssue({
            code: "custom",
            path: ['notes'],
            message: "Notes is required when type is 'WASTE'."
        })
    }
})

const Type = z.enum(
    Object.values(TransactionTypes) as [TransactionTypes, ...TransactionTypes[]]
).optional()

const MedicationId = z.coerce.number().positive().optional()

export const TransactionQuery = z.object({ type: Type, medicationId: MedicationId })