import { Medication, Transaction, User } from "../../src/generated/prisma/client.js"
import calculateNewQuantity from "../../src/utils/calculateNewQuantity.js"

export const mockUserTransactionBody = { medicationId: 2, nurseId: 2, witnessId: 3, type: "CHECKOUT", quantity: 30 }
export const mockedNurse: User = { id: 2, name: "Mike", email: "mike@gmail.com", role: "NURSE" }
export const mockedWitness: User = { id: 3, name: "Alice", email: "alice@gmail.com", role: "WITNESS" }
export const mockedMedication: Medication = { id: 2, name: "Ketamine", unit: "mg", schedule: "III", currentStockQuantity: 200 }
export const mockedUpdatedMedication: Medication = { 
    ...mockedMedication,
    currentStockQuantity: calculateNewQuantity({ type: mockUserTransactionBody.type, quantity: mockUserTransactionBody.quantity, currentQuantity: mockedMedication.currentStockQuantity })
}
export const mockedTransaction = { id: 1, notes: null } as Transaction